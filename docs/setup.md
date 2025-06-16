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

3.  **Create R2 Buckets:** Create buckets for the application's cache and images.

    ```bash
    npx wrangler r2 bucket create cepheus-onl-cache
    npx wrangler r2 bucket create cepheus-onl-images
    ```

4.  **Update Configuration:** The previous commands will output configuration details, including IDs for your new resources. Open the `wrangler.jsonc` file and update it with the correct `database_id` for your production D1 database and `preview_database_id` for your preview database. The R2 bucket names for `cepheus-onl-cache` and `cepheus-onl-images` should also be added to the `r2_buckets` section.

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

# Google AI
# Get this from Google AI Studio
GOOGLE_AI_API_KEY=
IMAGE_GENERATION_ENABLED=true

# Cloudflare R2
# These are required for the application to upload images to R2.
# Find your Account ID in the Cloudflare dashboard.
R2_ACCOUNT_ID=
# Create an R2 API token from the R2 page in the dashboard.
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=cepheus-onl-images
```

- `NEXTAUTH_SECRET`: A secret key for NextAuth.js to sign tokens.
- `NEXTAUTH_URL`: The full URL of your application for redirects.
- `DISCORD_CLIENT_ID`: The Client ID of your Discord application.
- `DISCORD_CLIENT_SECRET`: The Client Secret of your Discord application.
- `DISCORD_APP_PUBLIC_KEY`: The Public Key of your Discord application, for verifying interaction signatures.
- `DISCORD_BOT_TOKEN`: The token for your Discord bot.
- `DISCORD_CHANNEL_ID`: The ID of the Discord channel for the bot to send messages to.
- `GOOGLE_AI_API_KEY`: Your API key for Google AI services.
- `IMAGE_GENERATION_ENABLED`: Set to `true` to enable AI image generation for characters.
- `R2_ACCOUNT_ID`: Your Cloudflare account ID.
- `R2_ACCESS_KEY_ID`: The access key for your R2 API token.
- `R2_SECRET_ACCESS_KEY`: The secret key for your R2 API token.
- `R2_BUCKET_NAME`: The name of the R2 bucket for storing images.

**Note on Production Secrets:** For a production deployment, sensitive values like `DISCORD_CLIENT_SECRET`, `DISCORD_BOT_TOKEN`, `GOOGLE_AI_API_KEY`, and R2 credentials should not be stored in `wrangler.jsonc` or `.env` files. Instead, they should be set as secrets using the `wrangler secret put` command. The `IMAGE_GENERATION_ENABLED` flag can also be managed this way if you wish to control it remotely.

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
