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

### Receiving Messages (Webhooks)

To receive messages from Discord, we use webhooks.

An API route at `app/api/discord/webhook/route.ts` is set up to receive incoming webhook payloads from Discord. This endpoint is secured with a secret.

- `DISCORD_BOT_TOKEN`: The token for your Discord bot.
- `DISCORD_CHANNEL_ID`: The ID of the channel where the bot will send messages.
- `DISCORD_WEBHOOK_SECRET`: A secret to verify incoming webhooks.

### Setting up the Webhook in Discord

1.  Create a webhook in your Discord server's settings (Integrations > Webhooks).
2.  The webhook endpoint in the application is `/api/discord/webhook`. You will need to use a tool like `ngrok` to expose your local development server to the internet to test this.
3.  Secure your webhook by adding the `DISCORD_WEBHOOK_SECRET` to your environment variables and ensuring your bot sends this secret in a header (`x-webhook-secret`) with each request.
