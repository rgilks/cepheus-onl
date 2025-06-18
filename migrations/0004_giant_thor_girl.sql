CREATE TABLE `discord_games` (
	`id` text PRIMARY KEY NOT NULL,
	`discord_user_id` text NOT NULL,
	`character_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `generated_characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `discord_games_discord_user_id_unique` ON `discord_games` (`discord_user_id`);