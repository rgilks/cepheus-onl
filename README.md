# Cepheus Engine Online

This project is an online platform for playing the Cepheus Engine tabletop RPG, powered by a custom AI game master.

## Tech Stack

- **Framework:** [Next.js](httpss://nextjs.org/) using the [OpenNext](httpss://opennext.js.org/) adapter
- **Hosting & Backend:** [Cloudflare Workers](httpss://workers.cloudflare.com/)
- **Database:** [Cloudflare D1](httpss://developers.cloudflare.com/d1/) with [Drizzle ORM](httpss://orm.drizzle.team/)
- **Caching:** [Cloudflare R2](httpss://developers.cloudflare.com/r2/) for ISR and data cache
- **Authentication:** Discord OAuth
- **AI:** [Cloudflare Workers AI](httpss://developers.cloudflare.com/workers-ai/)
- **UI:** [React](httpss://react.dev/) with [Tailwind CSS](httpss://tailwindcss.com/)
- **Real-time:** [Cloudflare Durable Objects](httpss://developers.cloudflare.com/durable-objects/)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/rgilks/cepheus-onl.git
    cd cepheus-onl
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Cloudflare D1 & R2:**

    - Create your production and preview databases:
      ```bash
      npx wrangler d1 create cepheus-onl-db
      npx wrangler d1 create cepheus-onl-db-preview
      ```
    - Create your R2 cache bucket:
      ```bash
      npx wrangler r2 bucket create cepheus-onl-cache
      ```
    - Update `wrangler.jsonc` with the `database_id` and `preview_database_id` provided by the previous commands. The `bucket_name` should already be set correctly.

4.  **Run local migrations:**

    ```bash
    npm run migrate:local
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is deployed to Cloudflare Workers via a GitHub Actions workflow defined in `.github/workflows/deploy.yml`.

On every push to the `main` branch, the following steps are executed:

1.  Dependencies are installed.
2.  The Next.js application is built and adapted for Cloudflare using `@opennextjs/cloudflare`.
3.  The application is deployed to Cloudflare Workers using the `wrangler` CLI.

All configuration for the deployment, including D1 and R2 bindings, is managed in the `wrangler.jsonc` file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

A Cepheus Engine VTT and character manager.

A full featured VTT and character manager for the Cepheus Engine SRD.
