# Discord Integration

This document outlines the setup for Discord authentication and messaging within the application.

## Authentication

We use `next-auth` with the `DrizzleAdapter` to handle authentication with Discord. This allows users to log in with their Discord accounts.

### Environment Variables

All required environment variables for Discord integration are documented in the [Setup Guide](./setup.md#step-4-configure-environment-variables).

### Database Schema

The `next-auth` Drizzle adapter requires a specific database schema to store user and session information. The following tables are added to `lib/db/schema.ts`:

- `users`
- `accounts`
- `sessions`
- `verificationTokens`

Migrations for these tables are handled by `drizzle-kit`.

## Messaging

The application can send messages to a Discord channel and is set up to receive messages via webhooks.

### Sending Messages

The `sendDiscordMessage` server action in `app/lib/discord/actions.ts` handles sending messages to a specified channel. This action calls the Discord API directly to deliver the message.

### Handling Discord Interactions (Slash Commands)

To receive interactions from Discord, such as slash commands, we use an Interactions Endpoint.

An API route at `app/api/discord/webhook/route.ts` is set up to receive incoming interaction payloads from Discord. This endpoint is secured by verifying the cryptographic signature of each request using the `DISCORD_APP_PUBLIC_KEY`.

#### Interaction Handling Flow

When an interaction is received, the following occurs:

1.  **Verification**: The request's signature is verified.
2.  **Interaction Routing**: The interaction is routed to the appropriate command handler based on its type (`ApplicationCommand` or `MessageComponent`).
3.  **Deferred Response**: The handler immediately returns a `DeferredChannelMessageWithSource` response. This tells Discord that we have received the interaction and will send a follow-up response later. This must happen within 3 seconds.
4.  **Background Processing**: The actual command logic (e.g., generating a character, fetching equipment) is executed in the background using Cloudflare's `ctx.waitUntil()`. This allows for long-running tasks that can take more than the 3-second limit.
5.  **Follow-up Response**: Once the background task is complete, it uses the Discord API to send a follow-up message to the user with the result of the command.

This deferred response pattern is crucial for building a scalable and responsive bot on a serverless platform.

### Slash Commands

The following slash commands are available:

- `/chargen race:<race>`: Generate a complete Cepheus Engine character for a chosen race.
- `/equipment item:<item>`: Look up an item from the rulebook.
- `/world`: Generate a random world.

### Registering Slash Commands

A script is available at `scripts/register-commands.ts` to register global slash commands with Discord. You can run this script using `npm run register-commands`. It reads command definitions (including options and choices) from the project and sends them to the Discord API.

### Setting up the Interactions Endpoint in Discord

1.  Go to your application in the [Discord Developer Portal](https://discord.com/developers/applications).
2.  In the "General Information" page, paste the public URL for your webhook endpoint into the "Interactions Endpoint URL" field.
3.  For local development, you will need to use a tool like `ngrok` to expose your local server and provide the public `https` URL to Discord. The endpoint path is `/api/discord/webhook`.
4.  Discord will send a `PING` interaction to verify the endpoint. The application code correctly handles this verification check.
