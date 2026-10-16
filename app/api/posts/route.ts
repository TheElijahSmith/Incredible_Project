import { getDb } from '../../../db';
import { posts } from '../../../db/schema';
import { z } from 'zod';
import {reviewRatingSchema} from '../../../lib/review-rating';
import { desc } from 'drizzle-orm';
export async function GET() {
 try { return Response.json({ posts: await getDb().select().from(posts).orderBy(desc(posts.createdAt)).limit(250) }, {headers:{'Cache-Control':'no-store'}}); }
 catch { return Response.json({error:'Could not load conversations. Please try again.'},{status:503}); }
}
export async function POST(req:Request) {
 try {
 const parsed=z.object({kind:z.enum(['chat','review']),hall:z.enum(['The Caf','Student Center','Bison Cafe']),author:z.string().trim().min(1).max(30),body:z.string().trim().min(1).max(1000),dish:z.string().max(80).default(''),rating:z.number().int().min(0).max(27).default(0)}).safeParse(await req.json());
 if(!parsed.success)return Response.json({error:'Check your name, message, and rating.'},{status:400});
 const p=parsed.data;
 if (!['chat','review'].includes(p.kind)||!['The Caf','Student Center','Bison Cafe'].includes(p.hall)||typeof p.author!=='string'||!p.author.trim()||p.author.length>30||typeof p.body!=='string'||!p.body.trim()||p.body.length>1000) return Response.json({error:'Please add a name and a message (up to 1,000 characters).'},{status:400});
 if(p.kind==='review'&&(!reviewRatingSchema.safeParse(p.rating).success||typeof p.dish!=='string'||!p.dish.trim()||p.dish.length>80)) return Response.json({error:'Choose a dish and a rating from 0 to 27.'},{status:400});
 const post={id:crypto.randomUUID(),kind:p.kind,hall:p.hall,author:p.author.trim(),body:p.body.trim(),dish:p.kind==='review'?p.dish.trim():'',rating:p.kind==='review'?p.rating:0,ratingScale:27,createdAt:Date.now()};
 await getDb().insert(posts).values(post);return Response.json({post},{status:201});
 } catch {return Response.json({error:'Your post could not be saved. Please try again.'},{status:503});}
}
