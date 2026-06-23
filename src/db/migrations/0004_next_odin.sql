CREATE TABLE `checker_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`brand_name` text NOT NULL,
	`website_url` text NOT NULL,
	`industry` text,
	`competitors` text,
	`email` text NOT NULL,
	`platforms` text NOT NULL,
	`role` text,
	`submitted_at` text NOT NULL
);
