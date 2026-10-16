export const TOP_RATING_LABEL="The Wild Donkey's quench their thirst.";
export const ZERO_RATING_LABEL='Weeping and Gnashing of teeth';
export function ratingLabel(score:number,scale:number):string|null{
 if(score===0)return ZERO_RATING_LABEL;
 if((scale===27||scale===16)&&score===scale)return TOP_RATING_LABEL;
 return null;
}
