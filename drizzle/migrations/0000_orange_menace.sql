CREATE TABLE `messages` (
	`ts` text PRIMARY KEY NOT NULL,
	`threadTs` text NOT NULL,
	`channel` text NOT NULL,
	`edited` integer NOT NULL,
	`user` text NOT NULL,
	`reactions` text,
	`files` text
);
