import {z} from 'zod';
export const reviewRatingSchema=z.number().int().min(0).max(27);
