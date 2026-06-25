CREATE TABLE `ai_usage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`feature` text NOT NULL,
	`success` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
