CREATE TABLE `manual_audit_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`checkout_id` text,
	`request_id` text NOT NULL,
	`website_url` text NOT NULL,
	`email` text NOT NULL,
	`competitors` text,
	`notes` text,
	`notification_error` text,
	`created_at` integer NOT NULL,
	`paid_at` integer,
	`notified_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `manual_audit_orders_request_id_idx` ON `manual_audit_orders` (`request_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `manual_audit_orders_checkout_id_idx` ON `manual_audit_orders` (`checkout_id`);--> statement-breakpoint
CREATE INDEX `manual_audit_orders_status_idx` ON `manual_audit_orders` (`status`);--> statement-breakpoint
CREATE INDEX `manual_audit_orders_email_idx` ON `manual_audit_orders` (`email`);--> statement-breakpoint
CREATE INDEX `manual_audit_orders_created_at_idx` ON `manual_audit_orders` (`created_at`);