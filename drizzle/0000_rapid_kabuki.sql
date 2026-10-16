CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`hall` text NOT NULL,
	`author` text NOT NULL,
	`body` text NOT NULL,
	`dish` text NOT NULL,
	`rating` integer NOT NULL,
	`created_at` integer NOT NULL
);
