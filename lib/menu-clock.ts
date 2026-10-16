export const MENU_REFRESH_MS=5*60*1000;
export function hardingDate(at:Date=new Date()):string{
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(at);
 const value=(type:string)=>parts.find(p=>p.type===type)!.value;
 return `${value('year')}-${value('month')}-${value('day')}`;
}
