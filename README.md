# Cepheus Engine Online

This project is an online platform for playing the Cepheus Engine tabletop RPG, powered by a custom AI game master. It aims to provide a full-featured Virtual Tabletop (VTT) and character manager for the Cepheus Engine SRD.

## Tech Stack

- **Framework:** [Next.js](httpss://nextjs.org/) using the [OpenNext](httpss://opennext.js.org/) adapter
- **Hosting & Backend:** [Cloudflare Workers](httpss://workers.cloudflare.com/)
- **Database:** [Cloudflare D1](httpss://developers.cloudflare.com/d1/) with [Drizzle ORM](httpss://orm.drizzle.team/)
- **Caching:** [Cloudflare R2](httpss://developers.cloudflare.com/r2/) for ISR and data cache
- **Authentication:** Discord OAuth
- **AI:** [Cloudflare Workers AI](httpss://developers.cloudflare.com/workers-ai/)
- **UI:** [React](httpss://react.dev/) with [Tailwind CSS](httpss://tailwindcss.com/)
- **Real-time:** [Cloudflare Durable Objects](httpss://developers.cloudflare.com/durable-objects/) (planned)
- **3D Rendering:** [React Three Fiber](httpss://docs.pmnd.rs/react-three-fiber/getting-started/introduction) (for VTT)

## Architecture

The application is designed with a modern, serverless-first approach. For a detailed overview of the system's architecture, components, and data flow, please see the [Architecture documentation](./docs/architecture.md).

### Scalability and Cost Analysis

For a detailed analysis of the application's scalability, concurrency handling, and cost structure, please see the [Scalability and Cost Analysis document](./docs/scalability_and_cost_analysis.md).

## Discord Integration

This project uses NextAuth.js for Discord authentication and the Discord API for bot interactions. For a detailed guide on the setup, environment variables, and messaging implementation, please see the [Discord Integration document](./docs/discord-integration.md).

## Getting Started

For a comprehensive guide on setting up the project for local development and production, please refer to the [Setup documentation](./docs/setup.md).

A brief overview of the steps is as follows:

1.  **Clone and install:**
    ```bash
    git clone https://github.com/rgilks/cepheus-onl.git
    cd cepheus-onl
    npm install
    ```
2.  **Configure your environment:** Create a `.env` file and set up your Cloudflare D1/R2 resources as described in the setup guide.
3.  **Run local migrations:**
    ```bash
    npm run migrate:local
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## Deployment

This project is automatically deployed to Cloudflare Workers via a GitHub Actions workflow. On every push to the `main` branch, the application is built, adapted, and deployed.

All configuration for the deployment, including D1 and R2 bindings, is managed in the `wrangler.jsonc` file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
