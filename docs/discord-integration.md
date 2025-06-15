# Discord Integration

This document outlines the setup for Discord authentication and messaging within the application.

## Authentication

We use `next-auth` with the `DrizzleAdapter` to handle authentication with Discord. This allows users to log in with their Discord accounts.

### Environment Variables

The following environment variables are required for Discord authentication. These should be placed in your `.env.local` file.

- `NEXTAUTH_URL`: The base URL of the application. For local development, this is `http://localhost:3000`.
- `NEXTAUTH_SECRET`: A secret key for `next-auth`. You can generate one with `openssl rand -hex 32`.
- `DISCORD_CLIENT_ID`: Your Discord application's client ID.
- `DISCORD_CLIENT_SECRET`: Your Discord application's client secret.

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

We use the `@discordjs/rest` library to send messages. This is a lightweight, REST-only client that is suitable for serverless environments.

The `sendMessage` function in `lib/discord.ts` handles sending messages to a specified channel.

An API route at `app/api/discord/message/route.ts` exposes this functionality.

### Handling Discord Interactions (Slash Commands)

To receive interactions from Discord, such as slash commands, we use an Interactions Endpoint.

An API route at `app/api/discord/webhook/route.ts` is set up to receive incoming interaction payloads from Discord. This endpoint is secured by verifying the cryptographic signature of each request.

- `DISCORD_BOT_TOKEN`: The token for your Discord bot.
- `DISCORD_PUBLIC_KEY`: The public key for your Discord application, used to verify incoming interactions.
- `DISCORD_CHANNEL_ID`: The ID of the channel where the bot will send messages.

### Registering Slash Commands

A script is available at `scripts/register-commands.ts` to register global slash commands with Discord. You can run this script using `npm run register-commands`.

### Setting up the Interactions Endpoint in Discord

1.  Go to your application in the [Discord Developer Portal](https://discord.com/developers/applications).
2.  In the "General Information" page, paste the public URL for your webhook endpoint into the "Interactions Endpoint URL" field.
3.  For local development, you will need to use a tool like `ngrok` to expose your local server and provide the public `https` URL to Discord. The endpoint path is `/api/discord/webhook`.
4.  Discord will send a `PING` interaction to verify the endpoint. The application code correctly handles this verification check.
