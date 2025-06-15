CREATE TABLE `accounts` (
    `userId` text NOT NULL,
    `type` text NOT NULL,
    `provider` text NOT NULL,
    `providerAccountId` text NOT NULL,
    `refresh_token` text,
    `access_token` text,
    `expires_at` integer,
    `token_type` text,
    `scope` text,
    `id_token` text,
    `session_state` text,
    PRIMARY KEY(`provider`, `providerAccountId`),
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

--> statement-breakpoint
CREATE TABLE `boards` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text,
    `image` text,
    `url` text,
    `width` integer,
    `height` integer,
    `scale` real,
    `gameID` text NOT NULL,
    `owner` text,
    `boardInitiativeId` text,
    `createdAt` integer NOT NULL,
    `updatedAt` integer NOT NULL,
    FOREIGN KEY (`gameID`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE TABLE `characters` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text NOT NULL,
    `age` integer NOT NULL,
    `gender` text NOT NULL,
    `characteristics` text NOT NULL,
    `skills` text NOT NULL,
    `homeWorld` text,
    `terms` text NOT NULL,
    `careers` text NOT NULL,
    `backgroundSkills` text NOT NULL,
    `image` text,
    `cascadeSkills` text NOT NULL,
    `gameID` text NOT NULL,
    `owner` text NOT NULL,
    `canEnterDraft` integer NOT NULL,
    `credits` real NOT NULL,
    `failedToQualify` integer NOT NULL,
    `creationComplete` integer NOT NULL,
    `characteristicChanges` text NOT NULL,
    `displayTitle` integer NOT NULL,
    `materialBenefits` text NOT NULL,
    `lastDieRollResult` text,
    `equipment` text NOT NULL,
    `startingCredits` real,
    `notes` text,
    `animalData` text,
    `type` text,
    `description` text,
    `traits` text,
    `price` real,
    `hull` integer,
    `structure` integer,
    `initiative` integer,
    `haste` integer,
    `delay` integer,
    `reactions` integer,
    `active` integer,
    `initialPurchaseComplete` integer,
    `ledger` text,
    `createdAt` integer NOT NULL,
    `updatedAt` integer NOT NULL,
    FOREIGN KEY (`gameID`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

--> statement-breakpoint
CREATE TABLE `dieRolls` (
    `id` text PRIMARY KEY NOT NULL,
    `owner` text NOT NULL,
    `gameID` text NOT NULL,
    `characterID` text,
    `pieceID` text,
    `result` text NOT NULL,
    `createdAt` integer NOT NULL,
    `updatedAt` integer NOT NULL,
    FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`gameID`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`characterID`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE
    set
        null,
        FOREIGN KEY (`pieceID`) REFERENCES `pieces`(`id`) ON UPDATE no action ON DELETE
    set
        null
);

--> statement-breakpoint
CREATE TABLE `games` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text NOT NULL,
    `slug` text NOT NULL,
    `owner` text NOT NULL,
    `rulesetID` text NOT NULL,
    `gameSelectedBoardId` text,
    `allowSpectators` integer DEFAULT false,
    `allowCharacterDelete` integer DEFAULT false,
    `maxCharactersPerPlayer` integer DEFAULT 1,
    `allowCharacterImport` integer DEFAULT false,
    `restrictMovement` integer DEFAULT false,
    `createdAt` integer NOT NULL,
    `updatedAt` integer NOT NULL,
    FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`rulesetID`) REFERENCES `rulesets`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE UNIQUE INDEX `games_slug_unique` ON `games` (`slug`);

--> statement-breakpoint
CREATE TABLE `initiatives` (
    `id` text PRIMARY KEY NOT NULL,
    `owner` text,
    `characterID` text,
    `pieceID` text,
    `gameID` text NOT NULL,
    `boardID` text,
    `roundStart` integer,
    `createdAt` integer NOT NULL,
    `updatedAt` integer NOT NULL,
    FOREIGN KEY (`gameID`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`boardID`) REFERENCES `boards`(`id`) ON UPDATE no action ON DELETE
    set
        null
);

--> statement-breakpoint
CREATE TABLE `pieces` (
    `id` text PRIMARY KEY NOT NULL,
    `x` real NOT NULL,
    `y` real NOT NULL,
    `z` real,
    `image` text,
    `boardID` text NOT NULL,
    `gameID` text NOT NULL,
    `width` real,
    `height` real,
    `characterID` text,
    `owner` text,
    `scale` real,
    `targets` text,
    `selectedBy` text,
    `visibility` text,
    `freedom` text,
    `combatState` text,
    `name` text,
    `createdAt` integer NOT NULL,
    `updatedAt` integer NOT NULL,
    FOREIGN KEY (`boardID`) REFERENCES `boards`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`gameID`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`characterID`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE
    set
        null,
        FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE
    set
        null
);

--> statement-breakpoint
CREATE TABLE `players` (
    `id` text PRIMARY KEY NOT NULL,
    `owner` text NOT NULL,
    `gameID` text NOT NULL,
    `createdAt` integer NOT NULL,
    `updatedAt` integer NOT NULL,
    FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`gameID`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);

--> statement-breakpoint
CREATE TABLE `presences` (
    `id` text PRIMARY KEY NOT NULL,
    `owner` text NOT NULL,
    `gameID` text NOT NULL,
    `time` real NOT NULL,
    `left` integer,
    `createdAt` integer NOT NULL,
    `updatedAt` integer NOT NULL,
    FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`gameID`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);

--> statement-breakpoint
CREATE TABLE `rulesets` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text NOT NULL,
    `owner` text,
    `createdAt` integer NOT NULL,
    `updatedAt` integer NOT NULL,
    `data` text NOT NULL,
    FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE TABLE `sessions` (
    `sessionToken` text PRIMARY KEY NOT NULL,
    `userId` text NOT NULL,
    `expires` integer NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

--> statement-breakpoint
CREATE TABLE `users` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text,
    `email` text NOT NULL,
    `emailVerified` integer,
    `image` text
);

--> statement-breakpoint
CREATE TABLE `verificationTokens` (
    `identifier` text NOT NULL,
    `token` text NOT NULL,
    `expires` integer NOT NULL,
    PRIMARY KEY(`identifier`, `token`)
);

--> statement-breakpoint
CREATE TABLE `worlds` (
    `id` text PRIMARY KEY NOT NULL,
    `name` text NOT NULL,
    `size` integer,
    `hydrographics` integer,
    `population` integer,
    `primaryStarport` text,
    `government` integer,
    `lawLevel` integer,
    `techLevel` integer,
    `tradeCodes` text,
    `atmosphere` integer,
    `gameID` text NOT NULL,
    `createdAt` integer NOT NULL,
    `updatedAt` integer NOT NULL,
    FOREIGN KEY (`gameID`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);