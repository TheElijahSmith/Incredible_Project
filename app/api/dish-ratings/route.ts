import {getDb} from '../../../db';
import {posts} from '../../../db/schema';
import {sql,eq,and,count} from 'drizzle-orm';
export async function GET(){
 try{
 const key=sql<string>`lower(trim(${posts.dish}))`;
 const rows=await getDb().select({hall:posts.hall,dishKey:key,average:sql<number>`avg(1.0 * ${posts.rating} * 27 / ${posts.ratingScale})`,count:count()}).from(posts).where(and(eq(posts.kind,'review'),sql`${posts.ratingScale} > 0`,sql`${posts.rating} >= 0 AND ${posts.rating} <= ${posts.ratingScale}`)).groupBy(posts.hall,key);
 return Response.json({ratings:rows},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Food averages could not be loaded.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
