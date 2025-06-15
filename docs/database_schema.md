# Database Schema

The database schema is designed for Cloudflare D1 (which uses SQLite) and is based on the GraphQL schema from a previous version of the project.

## General Mapping Strategy

- **Models to Tables**: Each GraphQL type with an `@model` directive is mapped to an SQL table (e.g., `Game` -> `games`). Table and column names use `snake_case` for consistency with SQL conventions.
- **Fields to Columns**:
  - Scalar types like `ID`, `String`, and `AWSDateTime` are mapped to `TEXT`. `ID` fields serve as primary keys.
  - `Int` is mapped to `INTEGER`.
  - `Float` is mapped to `REAL`.
  - `Boolean` is mapped to `INTEGER` (0 for false, 1 for true).
- **Complex/Nested Data**: GraphQL types without an `@model` directive (e.g., `Characteristics`, `Item`, `Term`) and fields with type `AWSJSON` or array types are stored as `TEXT` columns containing JSON data. This leverages D1's native JSON support, simplifies the schema, and maintains the data structure from the original design.
- **Relationships & Keys**:
  - One-to-many relationships, indicated by `@connection` and `@key` directives, are implemented using foreign key columns (e.g., `characters.game_id`).
  - `@key` directives are used as a reference to create `INDEX`es on the specified columns to optimize queries.
- **Authentication/Authorization**: `@auth` rules are not represented in the schema. This logic will be implemented in the Cloudflare Worker backend code that accesses the database.

## Schema-to-SQL Mapping

Below is a summary of how the main GraphQL models are translated into SQL tables.

- `Game` -> `games`
- `Player` -> `players` (Represents a user's association with a specific game)
- `Character` -> `characters`
- `World` -> `worlds`
- `Board` -> `boards`
- `Piece` -> `pieces`
- `Ruleset` -> `rulesets`
- `Initiative` -> `initiatives`
- `Presence` -> `presences`
- `DieRoll` -> `die_rolls`

## Authentication Tables (NextAuth.js)

In addition to the core application tables, the following tables are required by the `next-auth` Drizzle adapter to manage user authentication and sessions:

- `users`: Stores user profile information (e.g., name, email, image). This is the central table for user accounts.
- `accounts`: Links user accounts to different OAuth providers (e.g., a user's Discord account).
- `sessions`: Stores active user sessions for authentication state management.
- `verificationTokens`: Used for email-based login verification, although not currently used in our Discord-only OAuth flow.
