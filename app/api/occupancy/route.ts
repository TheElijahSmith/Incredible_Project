import {env} from 'cloudflare:workers';
import {normalizeOccupancy} from '../../../lib/occupancy';
export async function GET(){
 const config=env as unknown as {CAF_OCCUPANCY_FEED_URL?:string;CAF_OCCUPANCY_FEED_TOKEN?:string};
 const headers={'Cache-Control':'no-store'};
 if(!config.CAF_OCCUPANCY_FEED_URL)return Response.json({status:'not_connected',count:null,message:'Waiting for a Harding-authorized swipe-data feed. No live count is available.'},{headers});
 try{
 const url=new URL(config.CAF_OCCUPANCY_FEED_URL);if(url.protocol!=='https:')throw Error();
 const r=await fetch(url,{headers:config.CAF_OCCUPANCY_FEED_TOKEN?{Authorization:`Bearer ${config.CAF_OCCUPANCY_FEED_TOKEN}`}:{},redirect:'error',signal:AbortSignal.timeout(8000)});
 if(!r.ok)throw Error();
 const data=normalizeOccupancy(await r.json());if(!data)throw Error();
 return Response.json(data,{headers});
 }catch{return Response.json({status:'unavailable',count:null,message:'The Caf count feed is currently unavailable.'},{headers});}
}
