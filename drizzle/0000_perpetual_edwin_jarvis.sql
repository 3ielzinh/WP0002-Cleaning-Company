CREATE TABLE `conversation_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`sender` text NOT NULL,
	`message` text NOT NULL,
	`sequence` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `conversation_messages_sequence_idx` ON `conversation_messages` (`conversation_id`,`sequence`);--> statement-breakpoint
CREATE INDEX `conversation_messages_conversation_id_idx` ON `conversation_messages` (`conversation_id`);--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`session_id` text NOT NULL,
	`channel` text NOT NULL,
	`summary` text NOT NULL,
	`message_count` integer NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `conversations_channel_session_idx` ON `conversations` (`channel`,`session_id`);--> statement-breakpoint
CREATE INDEX `conversations_lead_id_idx` ON `conversations` (`lead_id`);--> statement-breakpoint
CREATE TABLE `lead_events` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`event_type` text NOT NULL,
	`source` text NOT NULL,
	`payload` text DEFAULT '{}' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `lead_events_lead_id_idx` ON `lead_events` (`lead_id`);--> statement-breakpoint
CREATE INDEX `lead_events_type_idx` ON `lead_events` (`event_type`);--> statement-breakpoint
CREATE INDEX `lead_events_created_at_idx` ON `lead_events` (`created_at`);--> statement-breakpoint
CREATE TABLE `lead_rate_limits` (
	`ip_hash` text PRIMARY KEY NOT NULL,
	`window_started_at` integer NOT NULL,
	`request_count` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lead_services` (
	`lead_id` text NOT NULL,
	`service` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`lead_id`, `service`),
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `lead_services_lead_id_idx` ON `lead_services` (`lead_id`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`normalized_email` text NOT NULL,
	`phone` text NOT NULL,
	`normalized_phone` text NOT NULL,
	`address` text NOT NULL,
	`property_size` integer NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`first_source` text NOT NULL,
	`latest_source` text NOT NULL,
	`terms_accepted` integer NOT NULL,
	`policy_accepted` integer NOT NULL,
	`consent_version` text NOT NULL,
	`consented_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `leads_normalized_email_idx` ON `leads` (`normalized_email`);--> statement-breakpoint
CREATE INDEX `leads_normalized_phone_idx` ON `leads` (`normalized_phone`);--> statement-breakpoint
CREATE INDEX `leads_status_idx` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `leads_created_at_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE TABLE `submission_receipts` (
	`idempotency_key` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`disposition` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade
);
