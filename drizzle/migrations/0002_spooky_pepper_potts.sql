CREATE TABLE `channels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `threads` (
	`ts` text PRIMARY KEY NOT NULL,
	`channel` text NOT NULL,
	`headId` text NOT NULL
);
