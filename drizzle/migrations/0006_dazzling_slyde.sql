PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_threads` (
	`ts` text PRIMARY KEY NOT NULL,
	`archivedAt` text NOT NULL,
	`channel` text NOT NULL,
	`metadata` text DEFAULT '{"messagesAmount":0,"userAvatars":[]}' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_threads`("ts", "archivedAt", "channel", "metadata") SELECT "ts", "archivedAt", "channel", "metadata" FROM `threads`;--> statement-breakpoint
DROP TABLE `threads`;--> statement-breakpoint
ALTER TABLE `__new_threads` RENAME TO `threads`;--> statement-breakpoint
PRAGMA foreign_keys=ON;