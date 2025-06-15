# Application Architecture

This document outlines the architecture for the Cepheus Engine Online platform. It is designed to be a scalable, cost-effective, and real-time system for playing tabletop RPGs online, with deep integration into Discord.

## Core Technologies

- **Framework**: Next.js with OpenNext (running on Cloudflare Workers)
- **Database**: Cloudflare D1 with Drizzle ORM
- **Authentication**: Discord OAuth via NextAuth.js
- **Real-time Engine**: Cloudflare Durable Objects
- **AI Game Master**: Cloudflare Workers AI

## Architectural Diagram

```mermaid
graph TD
    subgraph User Endpoints
        A[Browser - Next.js UI]
        B[Discord Client]
    end

    subgraph Cloudflare Network
        AppWorker[OpenNext Application Worker]
        F[Durable Objects for Game State <br/>(Planned)]
        G[Cloudflare D1 Database]
        H[Workers AI <br/>(Planned)]
    end

    subgraph External Services
        I[Discord API]
    end

    A -- HTTP Requests --> AppWorker
    B -- Bot Commands/Interactions --> AppWorker
    AppWorker -- Immediate Deferred Response --> B
    AppWorker -- DB Queries --> G
    AppWorker -.-> F
    AppWorker -.-> H
    AppWorker -- Authenticates via --> I

    subgraph "Background Task (ctx.waitUntil)"
        J[Command Logic]
    end

    AppWorker -- Triggers --> J
    J -- Follow-up Message --> I
    J -- DB Queries --> G

    F -- Persists State --> G
```

## System Breakdown

### 1. Application Framework (Next.js with OpenNext)

- The entire application is a monolithic Next.js project adapted for Cloudflare using the OpenNext library. This includes the UI, backend API, and Discord bot logic.
- OpenNext compiles the Next.js application into a single Cloudflare Worker, allowing for server-side rendering, API routes, and static file serving from a unified deployment.
- This architecture simplifies development and deployment while leveraging the performance of Cloudflare's global network.

### 2. Authentication (Discord OAuth)

- Users log in via Discord using NextAuth.js.
- An API route at `/api/auth/[...nextauth]` handles the OAuth2 handshake with Discord's API.
- Upon successful authentication, a session is created, and the user's Discord ID and profile information are stored in the `users` table, as defined by the Drizzle adapter schema.

### 3. Real-time Game State (Durable Objects)

This feature is **planned for a future phase** of the project.

- Each active game session (e.g., a specific game board or combat instance) will be managed by a unique Durable Object.
- Durable Objects are ideal for this use case because they provide a single-threaded, stateful context that can be accessed globally, solving many complexities of managing real-time multiplayer state.
- The Durable Object will hold the current state of the game in memory (e.g., piece positions, initiative order) and persist it to the D1 database periodically or when critical events occur.

### 4. Discord Bot Integration

- The Discord "bot" is not a separate, long-running process. Instead, it consists of API routes within the Next.js application that handle interactions from Discord.
- The primary endpoint at `/api/discord/webhook` receives all interactions (like slash commands) from Discord.
- It immediately sends a deferred response to Discord to acknowledge the interaction and then processes the command in the background using `ctx.waitUntil`.
- This allows for long-running commands (e.g., character generation) to execute without timing out. The result is sent back to Discord as a follow-up message.
- This serverless, asynchronous pattern ensures the bot is both scalable and responsive.

### 5. Ruleset & AI Engine

- The game's rules, provided in the `data` directory as JSON and HTML files, are **planned to be seeded** into the `rulesets` table in the D1 database. Currently, this is a manual process.
- When a game is created, it will be linked to a specific ruleset.
- The AI Game Master, powered by Cloudflare Workers AI, is a **planned feature** that will use the ruleset data in conjunction with Large Language Models to make decisions, generate narrative content, and respond to player actions.
