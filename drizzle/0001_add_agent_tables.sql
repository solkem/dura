CREATE TABLE `agent_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`paper_id` text,
	`agent` text,
	`model` text,
	`tokens_in` integer,
	`tokens_out` integer,
	`latency_ms` integer,
	`created_at` text DEFAULT '2026-01-18T14:51:17.427Z'
);
--> statement-breakpoint
CREATE TABLE `invitation` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'researcher' NOT NULL,
	`invited_by` text,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	FOREIGN KEY (`invited_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invitation_token_unique` ON `invitation` (`token`);--> statement-breakpoint
CREATE TABLE `paper_relations` (
	`id` text PRIMARY KEY NOT NULL,
	`source_paper_id` text,
	`target_paper_id` text,
	`relationship` text,
	`strength` real,
	`explanation` text,
	`created_at` text DEFAULT '2026-01-18T14:51:17.427Z',
	FOREIGN KEY (`source_paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `papers` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`authors` text,
	`year` integer,
	`venue` text,
	`doi` text,
	`arxiv_id` text,
	`abstract` text,
	`bibtex` text,
	`tags` text,
	`domain` text,
	`relevance_score` real,
	`difficulty` integer,
	`domain_tags` text,
	`ecosystem_tags` text,
	`curator_status` text DEFAULT 'pending',
	`curator_notes` text,
	`summary_one_liner` text,
	`summary_paragraph` text,
	`summary_nyakupfuya` text,
	`prerequisites` text,
	`processed_at` text,
	`created_at` text DEFAULT '2026-01-18T14:51:17.427Z'
);
--> statement-breakpoint
ALTER TABLE `user` ADD `email` text;--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `created_at` integer DEFAULT 1768747877427 NOT NULL;