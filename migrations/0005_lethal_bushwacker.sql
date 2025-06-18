PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_generated_characters` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`race` text NOT NULL,
	`description` text NOT NULL,
	`story` text NOT NULL,
	`stats` text NOT NULL,
	`skills` text NOT NULL,
	`equipment` text NOT NULL,
	`image` text,
	`location` text NOT NULL,
	`owner` text
);
--> statement-breakpoint
INSERT INTO `__new_generated_characters`("id", "name", "race", "description", "story", "stats", "skills", "equipment", "image", "location", "owner") SELECT "id", "name", "race", "description", "story", "stats", "skills", "equipment", "image", "location", "owner" FROM `generated_characters`;--> statement-breakpoint
DROP TABLE `generated_characters`;--> statement-breakpoint
ALTER TABLE `__new_generated_characters` RENAME TO `generated_characters`;--> statement-breakpoint
PRAGMA foreign_keys=ON;