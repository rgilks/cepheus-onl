# Setting Up Your Development Environment

This guide will walk you through setting up the project for local development.

## Prerequisites

Before you start, make sure you have the following installed on your computer:

- **[Node.js](httpss://nodejs.org/):** The JavaScript runtime used for this project. We recommend the latest Long-Term Support (LTS) version.
- **[Git](httpss://git-scm.com/):** The version control system used to manage the codebase.
- **A [GitHub](httpss://github.com/) Account:** Required to clone the repository.
- **A [Cloudflare](httpss://www.cloudflare.com/) Account:** Required for the database, caching, and deployment.

## Step 1: Clone the Repository

First, get a copy of the project code onto your local machine.

```bash
git clone https://github.com/rgilks/cepheus-onl.git
cd cepheus-onl
```

## Step 2: Install Dependencies

Install all the necessary project libraries and tools.

```bash
npm install
```

## Step 3: Configure Cloudflare Resources

The project uses Cloudflare D1 for its database and R2 for caching. You need to create these resources in your Cloudflare account and link them to your local project.

1.  **Log in to Wrangler:** Authenticate the Wrangler CLI with your Cloudflare account.

    ```bash
    npx wrangler login
    ```

2.  **Create D1 Databases:** Create separate databases for production and local preview environments.

    ```bash
    npx wrangler d1 create cepheus-onl-db
    npx wrangler d1 create cepheus-onl-db-preview
    ```

3.  **Create R2 Bucket:** Create a bucket for the application's cache.

    ```bash
    npx wrangler r2 bucket create cepheus-onl-cache
    ```

4.  **Update Configuration:** The previous commands will output configuration details, including IDs for your new resources. Open the `wrangler.jsonc` file and update it with the correct `database_id` for your production D1 database and `preview_database_id` for your preview database. The R2 `bucket_name` should already be correctly set to `cepheus-onl-cache`.

## Step 4: Configure Environment Variables

Create a new file named `.env.local` in the root of the project. This file will hold your secret keys and environment-specific settings.

```
# .env.local

# NextAuth.js
# You can generate a secret with `openssl rand -hex 32`
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Discord OAuth & Bot
# Get these from your application in the Discord Developer Portal
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_APP_PUBLIC_KEY=
DISCORD_BOT_TOKEN=
DISCORD_CHANNEL_ID=
```

- `NEXTAUTH_SECRET`: A secret key for NextAuth.js to sign tokens.
- `NEXTAUTH_URL`: The full URL of your application for redirects.
- `DISCORD_CLIENT_ID`: The Client ID of your Discord application.
- `DISCORD_CLIENT_SECRET`: The Client Secret of your Discord application.
- `DISCORD_APP_PUBLIC_KEY`: The Public Key of your Discord application, for verifying interaction signatures.
- `DISCORD_BOT_TOKEN`: The token for your Discord bot.
- `DISCORD_CHANNEL_ID`: The ID of the Discord channel for the bot to send messages to.

## Step 5: Run Database Migrations

Apply the database schema to your local preview database.

```bash
npm run migrate:local
```

This command uses the Drizzle ORM to set up the necessary tables in your `cepheus-onl-db-preview` database.

## Step 6: Start the Development Server

You are now ready to run the application locally.

```bash
npm run dev
```

Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application running. Any changes you make to the code will be automatically reflected.

You have now successfully set up your complete development environment.
