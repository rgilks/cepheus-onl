# Data Seeding

This document describes the process for seeding initial data, such as game rulesets, into the Cloudflare D1 database.

## Ruleset Seeding

The core rules for the game are defined in JSON files located in the `/data` directory. For the initial setup, we will focus on seeding the `cepheus-engine-srd.json` file. In the future, this process can be extended to allow for custom rulesets.

The data will be inserted into the `rulesets` table in the D1 database.

### Seeding Script

A script will be created at `scripts/seed.ts` to handle the seeding process. This script will:

1.  Read the `cepheus-engine-srd.json` file from the `/data` directory.
2.  Connect to the Cloudflare D1 database using Wrangler's local development context.
3.  Insert the JSON content into a new record in the `rulesets` table. The `data` column will contain the entire JSON object as a string.

### How to Run the Seeding Script

A new npm script will be added to `package.json`:

```json
"scripts": {
  "db:seed": "tsx scripts/seed.ts"
}
```

To seed the database, you will run the following command:

```bash
npm run db:seed
```

This script will need to be run after you have set up your local database and run the initial migrations. This ensures that the application has access to the core game rules when it starts.
