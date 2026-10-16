import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
export const posts = sqliteTable('posts', { id: text('id').primaryKey(), kind: text('kind').notNull(), hall: text('hall').notNull(), author: text('author').notNull(), body: text('body').notNull(), dish: text('dish').notNull(), rating: integer('rating').notNull(), ratingScale: integer('rating_scale').notNull().default(5), createdAt: integer('created_at').notNull() });

export const reviewRatings=sqliteTable('review_ratings',{reviewId:text('review_id').notNull().references(()=>posts.id,{onDelete:'cascade'}),userId:text('user_id').notNull(),score:integer('score').notNull(),updatedAt:integer('updated_at').notNull()},t=>[primaryKey({columns:[t.reviewId,t.userId]})]);
