CREATE TABLE `inv_users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`user_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inv_activateToken` (
	`id` text(255) NOT NULL,
	`token` text(384) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer,
	PRIMARY KEY(`id`, `token`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `emailIdx` ON `inv_users` (`email`);