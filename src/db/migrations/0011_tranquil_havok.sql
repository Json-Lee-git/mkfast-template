CREATE TABLE `ai_visibility_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`url` text NOT NULL,
	`score` integer NOT NULL,
	`score_label` text NOT NULL,
	`result_json` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ai_vis_snapshots_user_idx` ON `ai_visibility_snapshots` (`user_id`);--> statement-breakpoint
CREATE INDEX `ai_vis_snapshots_url_idx` ON `ai_visibility_snapshots` (`url`);--> statement-breakpoint
CREATE INDEX `ai_vis_snapshots_created_idx` ON `ai_visibility_snapshots` (`created_at`);--> statement-breakpoint
CREATE TABLE `monitor_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`url` text NOT NULL,
	`source` text NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `monitor_requests_status_idx` ON `monitor_requests` (`status`);--> statement-breakpoint
CREATE INDEX `monitor_requests_email_idx` ON `monitor_requests` (`email`);--> statement-breakpoint
CREATE INDEX `monitor_requests_url_idx` ON `monitor_requests` (`url`);--> statement-breakpoint
CREATE INDEX `monitor_requests_created_at_idx` ON `monitor_requests` (`created_at`);