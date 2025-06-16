CREATE TABLE `generated_characters` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`upp` text NOT NULL,
	`age` integer NOT NULL,
	`careers` text NOT NULL,
	`credits` integer NOT NULL,
	`skills` text NOT NULL,
	`speciesTraits` text,
	`equipment` text,
	`backstory` text,
	`r2_image_key` text,
	`createdAt` integer NOT NULL
);
