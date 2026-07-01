CREATE TABLE `conversion_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event` text NOT NULL,
	`path` text,
	`page_url` text,
	`referrer` text,
	`session_id` text,
	`variant` text,
	`payload_json` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `conversion_events_event_idx` ON `conversion_events` (`event`);--> statement-breakpoint
CREATE INDEX `conversion_events_session_id_idx` ON `conversion_events` (`session_id`);--> statement-breakpoint
CREATE INDEX `conversion_events_created_at_idx` ON `conversion_events` (`created_at`);