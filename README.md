# Cepheus Engine Online

Welcome to Cepheus Engine Online, a modern, serverless platform for playing the Cepheus Engine tabletop RPG. This project provides a comprehensive VTT experience with deep integration into Discord.

## Overview

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and configured to run on the [Cloudflare serverless platform](https://www.cloudflare.com/developer-platform/) using [OpenNext](https://open-next.js.org/).

The goal is to create a fully-featured, scalable, and cost-effective application for real-time, collaborative TTRPG gameplay.

## Core Technologies

- **Framework**: Next.js with OpenNext
- **Deployment**: Cloudflare Workers
- **Database**: Cloudflare D1 with Drizzle ORM
- **Authentication**: Discord OAuth via NextAuth.js
- **Real-time Engine**: (Planned) Cloudflare Durable Objects
- **AI Game Master**: (Planned) Cloudflare Workers AI

## Key Features

- **Discord Bot**: Interact with the game directly from Discord using slash commands.
  - Asynchronous command handling for a responsive experience.
  - `/chargen`: Generate a complete Cepheus Engine character.
  - `/equipment`: Browse the SRD equipment catalog.
- **Web UI**: A full-featured web interface for game management (in development).
- **Authentication**: Secure login with your Discord account.
- **Data Model**: A comprehensive database schema to manage games, characters, worlds, and more.

## Getting Started

To get started with local development, please see the detailed [Setup Guide](./docs/setup.md).

## Documentation

For more detailed information about the project, please refer to the documents in the `/docs` directory:

- **[Architecture](./docs/architecture.md)**: A high-level overview of the system architecture.
- **[Database Schema](./docs/database_schema.md)**: Detailed information about the database tables.
- **[Discord Integration](./docs/discord-integration.md)**: How the Discord bot and authentication are implemented.
- **[Setup Guide](./docs/setup.md)**: Instructions for setting up a local development environment.
- **[Scalability and Cost Analysis](./docs/scalability_and_cost_analysis.md)**: An analysis of the platform's scalability and cost.
- **[Testing](./docs/testing.md)**: Information about the project's testing strategy.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.
