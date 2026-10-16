import {hardingDate} from '../../../lib/menu-clock';
// Uses the same public read-only catalog endpoint and client headers as Harding's MyDiningHub site.
const endpoint='https://api.elevate-dxp.com/api/mesh/c087f756-cc72-4649-a36f-3a41b700c519/graphql';
const locations=['university-dining-hall','panda-express','starbucks','tackers-shake-shack','einsteins-bros-bagels','sunday-brunch','bison-deli','chick-fil-a','midnight-oil','bison-market','bison-cafe'];
const headers={'X-Api-Key':'ElevateAPIProd','Store':'ch_harding_en','Magento-Website-Code':'ch_harding','Magento-Store-Code':'ch_harding','Magento-Store-View-Code':'ch_harding_en'};
async function query<T>(q:string,variables:Record<string,unknown>):Promise<T>{
 const url=endpoint+'?'+new URLSearchParams({query:q,variables:JSON.stringify(variables)});
 const r=await fetch(url,{headers,signal:AbortSignal.timeout(20000)});
 if(!r.ok)throw new Error('Upstream menu unavailable');
 const d=await r.json() as {data:T;errors?:unknown[]};if(d.errors?.length||!d.data)throw new Error('Upstream menu unavailable');return d.data;
}
type Location={commerceAttributes:{hasActiveMenus:boolean;maxMenusDate:string;children:{id:number;name:string}[];meal_periods:{id:number;name:string;position:number}[]};aemAttributes:{name:string}};
type Recipes={locationRecipesMap:{stationSkuMap:{id:number;skus:string[]}[];dateSkuMap:{date:string;stations:{id:number;skus:{simple:string[];configurable:{sku:string;variants:string[]}[]}}[]}[]};products:{items:{id:string;name:string;sku:string}[]}};
const cache=new Map<string,{time:number;payload:unknown}>();
export async function GET(req:Request){
 const p=new URL(req.url).searchParams,location=p.get('location')||'university-dining-hall',date=p.get('date')||hardingDate(),meal=Number(p.get('meal')||16);
 if(!locations.includes(location)||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(meal)||meal<1||meal>100)return Response.json({error:'Invalid menu selection.'},{status:400});
 const responseHeaders={'Cache-Control':'no-store'};
 const key=location+date+meal,cached=cache.get(key);if(cached&&Date.now()-cached.time<300000)return Response.json(cached.payload,{headers:responseHeaders});
 const source='https://harding.mydininghub.com/en/location/'+location;
 try{
 const {getLocation:l}=await query<{getLocation:Location}>(`query($location:String!){getLocation(campusUrlKey:"campus",locationUrlKey:$location){commerceAttributes{hasActiveMenus maxMenusDate children{id name} meal_periods{id name position}} aemAttributes{name}}}`,{location});
 if(!l)throw Error();
 const periods=l.commerceAttributes.meal_periods||[],selected=periods.some(m=>m.id===meal)?meal:periods[0]?.id;
 let stations:{id:number;name:string;items:{name:string;sku:string}[]}[]=[];
 if(l.commerceAttributes.hasActiveMenus&&selected){
 const {getLocationRecipes:r}=await query<{getLocationRecipes:Recipes}>(`query($location:String!,$date:String!,$meal:Int!){getLocationRecipes(campusUrlKey:"campus",locationUrlKey:$location,date:$date,mealPeriod:$meal,viewType:DAILY){locationRecipesMap{stationSkuMap{id skus} dateSkuMap{date stations{id skus{simple configurable{sku variants}}}}} products{items{id name sku}}}}`,{location,date,meal:selected});
 const products=r?.products?.items||[],map=r?.locationRecipesMap;
 const daily=map?.dateSkuMap?.find(d=>d.date.slice(0,10)===date);
 const stationMap=daily?daily.stations.map(s=>({id:s.id,skus:[...(s.skus?.simple||[]),...(s.skus?.configurable||[]).map(c=>c.sku)]})):map?.stationSkuMap||[];
 stations=stationMap.map(s=>({id:s.id,name:l.commerceAttributes.children?.find(c=>String(c.id)===String(s.id))?.name||'Menu',items:products.filter(p=>s.skus.includes(p.sku)).map(p=>({name:p.name,sku:p.sku}))})).filter(s=>s.items.length>0);
 if(!stations.length&&products.length)stations=[{id:0,name:'Published menu',items:products.map(p=>({name:p.name,sku:p.sku}))}];
 }
 const payload={location:l.aemAttributes.name,date,meal:selected,periods,stations,source,retrievedAt:new Date().toISOString(),maxDate:l.commerceAttributes.maxMenusDate};
 if(cache.size>100)cache.clear();cache.set(key,{time:Date.now(),payload});return Response.json(payload,{headers:responseHeaders});
 }catch{return Response.json({error:'Harding’s menu service could not be reached. No substitute dishes are shown. Please try again or open the official menu.',source},{status:502,headers:responseHeaders});}
}
