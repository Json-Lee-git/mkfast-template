CREATE TABLE `webhook_events` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`event_id` text NOT NULL,
	`event_type` text NOT NULL,
	`target` text,
	`status` text NOT NULL,
	`error` text,
	`created_at` integer NOT NULL,
	`processed_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `webhook_events_provider_event_id_idx` ON `webhook_events` (`provider`,`event_id`);--> statement-breakpoint
CREATE INDEX `webhook_events_status_idx` ON `webhook_events` (`status`);--> statement-breakpoint
CREATE INDEX `webhook_events_event_type_idx` ON `webhook_events` (`event_type`);--> statement-breakpoint
CREATE INDEX `webhook_events_created_at_idx` ON `webhook_events` (`created_at`);