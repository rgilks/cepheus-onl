# Database Schema

This document describes the database schema for the Cepheus Engine Online application. We use Drizzle ORM to define and interact with our database. The schema is defined in `lib/db/schema.ts`.

## Tables

The database includes tables for core application data and for user authentication managed by NextAuth.js.

### Authentication Tables (NextAuth.js)

The following tables are automatically managed by the `@auth/drizzle-adapter` for NextAuth.js to handle user authentication and sessions.

- **`users`**: Stores user profile information (e.g., name, email, image). This is the central table for user accounts.
- **`accounts`**: Links user accounts to different OAuth providers (e.g., a user's Discord account).
- **`sessions`**: Stores active user sessions for authentication state management.
- **`verificationTokens`**: Used for passwordless login, such as email "magic links".

### Application Tables

These tables are specific to the Cepheus Engine Online application.

#### `notes`

A simple table for storing text notes. The purpose of this table is yet to be fully defined in the project.

- `id` (integer, primary key): A unique identifier for the note.
- `text` (string): The content of the note.

## Planned Tables

The following tables are planned for future development to support core application features.

### `characters`

This table will store information about player characters, a key feature for the character manager functionality.

- `id` (string, primary key): A unique identifier for the character.
- `userId` (string, foreign key to `users.id`): The user who owns this character.
- `name` (string): The character's name.
- `upp` (string): The character's Universal Personality Profile.
- `species` (string): The character's species.
- `homeworld` (string): The character's homeworld.
- `skills` (json): A JSON object containing the character's skills and their levels.
- `equipment` (json): A JSON object containing the character's equipment.
- `notes` (text): Free-form notes about the character.
