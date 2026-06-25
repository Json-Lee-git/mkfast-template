CREATE TABLE `report_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`status` text NOT NULL,
	`result_json` text NOT NULL,
	`email` text,
	`website_url` text NOT NULL,
	`created_at` integer NOT NULL,
	`activated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `report_tokens_token_unique` ON `report_tokens` (`token`);