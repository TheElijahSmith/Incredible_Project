'use client';
import {foodVerdict} from '../lib/food-score';
export type DishRating={hall:string;dishKey:string;average:number;count:number};
export default function FoodScore({rating,name,loading,error}:{rating?:DishRating;name:string;loading:boolean;error:string}){
 const average=!error&&!loading&&rating?.count?Number(rating.average):null,label=foodVerdict(average);
 return <div className={'food-score '+(label==='Beatific'?'beatific':label==='satanic panic'?'panic':'')}><div className="food-score-header"><span className="food-verdict">{error?'Ratings unavailable':loading?'Loading reviews…':label||'Not reviewed yet'}</span>{!error&&!loading&&average!==null&&<strong>{average.toFixed(2)} <small>/ 27</small></strong>}</div><input type="range" min={0} max={27} step="any" value={average??0} disabled aria-label={`${name}: ${error?'ratings unavailable':loading?'ratings loading':average===null?'no reviews':`${average.toFixed(2)} out of 27 stars, ${label}`}`} title="Average of food reviews; add a review to change it"/><div className="food-score-foot"><span>0</span><span>{!error&&!loading&&(rating?.count?`${rating.count} ${rating.count===1?'review':'reviews'}`:'Be the first to review')}</span><span>27</span></div></div>
}
