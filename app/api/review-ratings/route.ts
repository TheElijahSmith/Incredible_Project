import {getDb} from '../../../db';
import {posts,reviewRatings} from '../../../db/schema';
import {getChatGPTUser} from '../../chatgpt-auth';
import {and,eq,avg,count} from 'drizzle-orm';
import {metaRatingInput} from '../../../lib/meta-rating';
const headers={'Cache-Control':'no-store'};
export async function GET(){
 try{
 const user=await getChatGPTUser(),db=getDb();
 const summaries=await db.select({reviewId:reviewRatings.reviewId,average:avg(reviewRatings.score),count:count()}).from(reviewRatings).groupBy(reviewRatings.reviewId);
 const mine=user?await db.select({reviewId:reviewRatings.reviewId,score:reviewRatings.score}).from(reviewRatings).where(eq(reviewRatings.userId,user.userId)):[];
 return Response.json({summaries:summaries.map(s=>({...s,average:Number(s.average)})),mine,signedIn:!!user},{headers});
 }catch{return Response.json({error:'Review ratings could not be loaded.'},{status:503,headers});}
}
export async function POST(req:Request){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in to rate a review.'},{status:401,headers});
 let raw;try{raw=await req.json()}catch{return Response.json({error:'Invalid rating request.'},{status:400,headers})}
 const parsed=metaRatingInput.safeParse(raw);if(!parsed.success)return Response.json({error:'Choose a whole-number rating from 0 to 16.'},{status:400,headers});
 try{
 const db=getDb(),{reviewId,score}=parsed.data;
 const [review]=await db.select({id:posts.id}).from(posts).where(and(eq(posts.id,reviewId),eq(posts.kind,'review'))).limit(1);
 if(!review)return Response.json({error:'Food review not found.'},{status:404,headers});
 await db.insert(reviewRatings).values({reviewId,userId:user.userId,score,updatedAt:Date.now()}).onConflictDoUpdate({target:[reviewRatings.reviewId,reviewRatings.userId],set:{score,updatedAt:Date.now()}});
 const [summary]=await db.select({average:avg(reviewRatings.score),count:count()}).from(reviewRatings).where(eq(reviewRatings.reviewId,reviewId));
 return Response.json({reviewId,score,average:Number(summary.average),count:summary.count},{headers});
 }catch{return Response.json({error:'Your rating could not be saved. Please try again.'},{status:503,headers});}
}
