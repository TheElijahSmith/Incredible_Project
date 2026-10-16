import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const posts = sqliteTable('posts', { id: text('id').primaryKey(), kind: text('kind').notNull(), hall: text('hall').notNull(), author: text('author').notNull(), body: text('body').notNull(), dish: text('dish').notNull(), rating: integer('rating').notNull(), createdAt: integer('created_at').notNull() });
