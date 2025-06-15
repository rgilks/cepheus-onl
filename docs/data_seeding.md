# Data Seeding

This document explains how to seed the database with initial data.

## Overview

For a complex application like Cepheus Engine Online, it's essential to have a consistent set of starting data for development, testing, and even production. This might include:

- Standard items, weapons, and armor from the Cepheus Engine SRD.
- Premade character templates.
- Initial world state for the AI Game Master.

## Seeding Process

Currently, there is no automated seeding process implemented. Data is managed directly in the database.

As the project evolves, we will implement a seeding mechanism. The plan is to:

1.  **Store Seed Data:** Define seed data in files within the `data/` directory. We will use the Cepheus SRD data available in this repository.
2.  **Create a Seed Script:** Develop a script in `scripts/seed.ts` that reads the data files and populates the database using Drizzle ORM.
3.  **Run the Script:** The script will be executable via an `npm run` command, like `npm run db:seed`.

## SRD Data

The `data/cepheus-srd` directory contains the Cepheus Engine SRD data in HTML format, which will be used for seeding the database. This data will need to be parsed before it can be inserted into the database.
