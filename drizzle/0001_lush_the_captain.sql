CREATE TABLE `notification_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`next_attempt_at` integer NOT NULL,
	`sent_at` integer,
	`last_error` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `notification_outbox_status_next_idx` ON `notification_outbox` (`status`,`next_attempt_at`);--> statement-breakpoint
CREATE INDEX `notification_outbox_lead_id_idx` ON `notification_outbox` (`lead_id`);--> statement-breakpoint
CREATE TABLE `voice_sessions` (
	`call_sid` text PRIMARY KEY NOT NULL,
	`from_number` text NOT NULL,
	`step` text NOT NULL,
	`data` text DEFAULT '{}' NOT NULL,
	`transcript` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `voice_sessions_updated_at_idx` ON `voice_sessions` (`updated_at`);