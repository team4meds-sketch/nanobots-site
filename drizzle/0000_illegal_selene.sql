CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`cover` text DEFAULT '' NOT NULL,
	`video_url` text DEFAULT '' NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`date` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_entries_published_date` ON `entries` (`published`,`date`);