import {z} from 'zod';
export const occupancySchema=z.object({count:z.number().int().min(0).max(100000),updatedAt:z.string().datetime({offset:true}),kind:z.enum(['occupancy','estimate']),source:z.string().trim().min(1).max(100),method:z.string().trim().min(1).max(250)});
export function normalizeOccupancy(input:unknown,now=Date.now()){
 const p=occupancySchema.safeParse(input);
 if(!p.success)return null;
 const age=now-Date.parse(p.data.updatedAt);
 if(age < -60000)return null;
 return {...p.data,status:age>120000?'stale' as const:'live' as const};
}
