import {z} from 'zod';
export const occupancySchema=z.object({count:z.number().int().min(0).max(100000),updatedAt:z.string().datetime({offset:true}),kind:z.enum(['occupancy','estimate']),source:z.string().trim().min(1).max(100),method:z.string().trim().min(1).max(250)});
const swipeSchema=z.object({kind:z.literal('swipes'),updatedAt:z.string().datetime({offset:true}),coverageStartedAt:z.string().datetime({offset:true}),source:z.string().trim().min(1).max(100),entries:z.array(z.object({enteredAt:z.string().datetime({offset:true}),count:z.number().int().min(1).max(100000)})).max(10000)});
export const DWELL_TIME_MS=15*60*1000;
export function normalizeOccupancy(input:unknown,now=Date.now()){
 const swipes=swipeSchema.safeParse(input);
 if(swipes.success){
 const d=swipes.data,updated=Date.parse(d.updatedAt),coverage=Date.parse(d.coverageStartedAt);
 if(updated>now+60000||coverage>updated)return null;
 // Freeze stale readings at their observation time instead of silently draining an offline feed to zero.
 const reference=Math.min(now,updated),cutoff=reference-DWELL_TIME_MS;
 if(coverage>cutoff||d.entries.some(e=>Date.parse(e.enteredAt)>updated))return null;
 const count=d.entries.reduce((total,e)=>{const entered=Date.parse(e.enteredAt);return total+(entered>cutoff&&entered<=reference?e.count:0)},0);
 if(count>100000)return null;
 return {count,updatedAt:d.updatedAt,kind:'estimate' as const,source:d.source,method:'One estimated departure per entrance swipe, exactly 15 minutes after entry. Counts swipes in the preceding 15 minutes.',status:now-updated>120000?'stale' as const:'live' as const};
 }
 const p=occupancySchema.safeParse(input);if(!p.success)return null;
 const age=now-Date.parse(p.data.updatedAt);if(age < -60000)return null;
 return {...p.data,status:age>120000?'stale' as const:'live' as const};
}
