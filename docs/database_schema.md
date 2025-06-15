# Database Schema

This document describes the database schema for the Cepheus Engine Online application. We use Drizzle ORM to define and interact with our database. The schema is defined in `lib/db/schema.ts`.

All tables use `nanoid` to generate unique primary keys.

## Tables

### Authentication Tables (NextAuth.js)

The following tables are automatically managed by the `@auth/drizzle-adapter` for NextAuth.js to handle user authentication and sessions.

- **`users`**: Stores user profile information. This is the central table for user accounts.
- **`accounts`**: Links user accounts to different OAuth providers (e.g., a user's Discord account).
- **`sessions`**: Stores active user sessions for authentication state management.
- **`verificationTokens`**: Used for passwordless login, such as email "magic links".

### Application Tables

These tables are specific to the Cepheus Engine Online application.

#### `rulesets`

Stores the core rules for the Cepheus Engine, loaded from the SRD.

- `id`: Unique identifier.
- `name`: The name of the ruleset (e.g., "Cepheus Engine SRD").
- `owner`: Foreign key to `users.id` of the user who uploaded the ruleset.
- `data`: A JSON blob containing the entire ruleset data.

#### `games`

Represents a single game instance created by a user.

- `id`: Unique identifier.
- `name`: The name of the game.
- `slug`: A unique, URL-friendly slug for the game.
- `owner`: Foreign key to `users.id`.
- `rulesetID`: Foreign key to `rulesets.id`.
- `gameSelectedBoardId`: The ID of the currently active board in the game.
- Contains various boolean flags for game settings (e.g., `allowSpectators`, `allowCharacterDelete`).

#### `players`

Links users to the games they are participating in.

- `id`: Unique identifier.
- `owner`: Foreign key to `users.id`.
- `gameID`: Foreign key to `games.id`.

#### `worlds`

Stores information about worlds within a game, used for generating planetary data.

- `id`: Unique identifier.
- `name`: The name of the world.
- Contains fields for planetary characteristics (e.g., `size`, `population`, `techLevel`).
- `gameID`: Foreign key to `games.id`.

#### `boards`

Represents a game board or map within a game.

- `id`: Unique identifier.
- `name`: The name of the board.
- `url`: URL to the board's background image.
- `width`, `height`, `scale`: Dimensions and scale of the board.
- `gameID`: Foreign key to `games.id`.

#### `pieces`

Represents tokens or pieces placed on a game board.

- `id`: Unique identifier.
- `x`, `y`, `z`: Coordinates of the piece on the board.
- `image`: URL to the piece's image.
- `boardID`: Foreign key to `boards.id`.
- `characterID`: Foreign key to `characters.id`, linking a piece to a character.
- `owner`: Foreign key to `users.id`.

#### `initiatives`

Tracks turn order and initiative for combat or other timed events.

- `id`: Unique identifier.
- `characterID`: The character associated with this initiative entry.
- `pieceID`: The piece associated with this initiative entry.
- `gameID`: Foreign key to `games.id`.
- `boardID`: Foreign key to `boards.id`.

#### `characters`

Stores detailed information about player and non-player characters. This is the most complex table in the schema.

- `id`: Unique identifier.
- `name`, `age`, `gender`: Basic character information.
- `characteristics`, `skills`, `terms`, `careers`, `equipment`: JSON blobs containing detailed character stats and history from the character generation process.
- `gameID`: Foreign key to `games.id`.
- `owner`: Foreign key to `users.id`.
- Contains numerous fields to track the state of character creation, combat status, and inventory.
