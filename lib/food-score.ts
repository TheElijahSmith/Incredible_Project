export function foodVerdict(average:number|null):'Beatific'|'Aight'|'satanic panic'|null{
 if(average===null||!Number.isFinite(average))return null;
 if(average>=25)return 'Beatific';
 if(average<=4)return 'satanic panic';
 return 'Aight';
}
export function dishKey(name:string){return name.trim().toLowerCase()}
export function reviewHall(location:string){return location==='university-dining-hall'||location==='sunday-brunch'?'The Caf':location==='bison-cafe'?'Bison Cafe':'Student Center'}
