CREATE TABLE `review_ratings` (
	`review_id` text NOT NULL,
	`user_id` text NOT NULL,
	`score` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`review_id`, `user_id`),
	FOREIGN KEY (`review_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
