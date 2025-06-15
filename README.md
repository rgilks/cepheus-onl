# Cepheus Engine Online

This project is an online platform for playing the Cepheus Engine tabletop RPG, powered by a custom AI game master.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Hosting & Backend:** [Cloudflare Pages](https://pages.cloudflare.com/) & [Cloudflare Workers](https://workers.cloudflare.com/)
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** Discord OAuth
- **AI:** [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- **UI:** [React](https://react.dev/) with [Tailwind CSS](https://tailwindcss.com/)
- **Real-time:** [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd cepheus-onl
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Cloudflare D1:**

    - Create your production and preview databases:
      ```bash
      npx wrangler d1 create cepheus-onl-db
      npx wrangler d1 create cepheus-onl-db-preview
      ```
    - Update `wrangler.toml` with the `database_id` provided by the previous commands.

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

This project is configured for deployment on [Cloudflare Pages](https://pages.cloudflare.com/). Simply connect your Git repository to a new Cloudflare Pages project and configure the necessary environment variables for Discord OAuth.

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
