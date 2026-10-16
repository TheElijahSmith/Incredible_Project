import {z} from 'zod';
export const metaRatingInput=z.object({reviewId:z.string().min(1).max(100),score:z.number().int().min(0).max(16)});
