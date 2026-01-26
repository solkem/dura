PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_agent_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`paper_id` text,
	`agent` text,
	`model` text,
	`tokens_in` integer,
	`tokens_out` integer,
	`latency_ms` integer,
	`created_at` text DEFAULT '2026-01-26T05:06:33.343Z'
);
--> statement-breakpoint
INSERT INTO `__new_agent_logs`("id", "paper_id", "agent", "model", "tokens_in", "tokens_out", "latency_ms", "created_at") SELECT "id", "paper_id", "agent", "model", "tokens_in", "tokens_out", "latency_ms", "created_at" FROM `agent_logs`;--> statement-breakpoint
DROP TABLE `agent_logs`;--> statement-breakpoint
ALTER TABLE `__new_agent_logs` RENAME TO `agent_logs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_memories` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`confidence` real DEFAULT 0.5 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`source_agent` text,
	`evidence` text,
	`reviewed_by` text,
	`reviewed_at` text,
	`review_notes` text,
	`created_at` text DEFAULT '2026-01-26T05:06:33.343Z',
	`last_used_at` text,
	`use_count` integer DEFAULT 0,
	FOREIGN KEY (`reviewed_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_memories`("id", "type", "content", "confidence", "status", "source_agent", "evidence", "reviewed_by", "reviewed_at", "review_notes", "created_at", "last_used_at", "use_count") SELECT "id", "type", "content", "confidence", "status", "source_agent", "evidence", "reviewed_by", "reviewed_at", "review_notes", "created_at", "last_used_at", "use_count" FROM `memories`;--> statement-breakpoint
DROP TABLE `memories`;--> statement-breakpoint
ALTER TABLE `__new_memories` RENAME TO `memories`;--> statement-breakpoint
CREATE TABLE `__new_paper_relations` (
	`id` text PRIMARY KEY NOT NULL,
	`source_paper_id` text,
	`target_paper_id` text,
	`relationship` text,
	`strength` real,
	`explanation` text,
	`created_at` text DEFAULT '2026-01-26T05:06:33.343Z',
	FOREIGN KEY (`source_paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_paper_id`) REFERENCES `papers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_paper_relations`("id", "source_paper_id", "target_paper_id", "relationship", "strength", "explanation", "created_at") SELECT "id", "source_paper_id", "target_paper_id", "relationship", "strength", "explanation", "created_at" FROM `paper_relations`;--> statement-breakpoint
DROP TABLE `paper_relations`;--> statement-breakpoint
ALTER TABLE `__new_paper_relations` RENAME TO `paper_relations`;--> statement-breakpoint
CREATE TABLE `__new_papers` (
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
	`synthesizer_data` text,
	`processed_at` text,
	`created_at` text DEFAULT '2026-01-26T05:06:33.343Z'
);
--> statement-breakpoint
INSERT INTO `__new_papers`("id", "title", "authors", "year", "venue", "doi", "arxiv_id", "abstract", "bibtex", "tags", "domain", "relevance_score", "difficulty", "domain_tags", "ecosystem_tags", "curator_status", "curator_notes", "summary_one_liner", "summary_paragraph", "summary_nyakupfuya", "prerequisites", "synthesizer_data", "processed_at", "created_at") SELECT "id", "title", "authors", "year", "venue", "doi", "arxiv_id", "abstract", "bibtex", "tags", "domain", "relevance_score", "difficulty", "domain_tags", "ecosystem_tags", "curator_status", "curator_notes", "summary_one_liner", "summary_paragraph", "summary_nyakupfuya", "prerequisites", "synthesizer_data", "processed_at", "created_at" FROM `papers`;--> statement-breakpoint
DROP TABLE `papers`;--> statement-breakpoint
ALTER TABLE `__new_papers` RENAME TO `papers`;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`email` text,
	`role` text DEFAULT 'public' NOT NULL,
	`created_at` integer DEFAULT 1769403993342 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "username", "password_hash", "email", "role", "created_at") SELECT "id", "username", "password_hash", "email", "role", "created_at" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);