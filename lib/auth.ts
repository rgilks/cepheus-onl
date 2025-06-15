import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getDb } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { nanoid } from 'nanoid';
import { Adapter } from 'next-auth/adapters';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(() => {
  const db = getDb();
  return {
    adapter: {
      ...(DrizzleAdapter(db, {
        usersTable: schema.users,
        accountsTable: schema.accounts,
        sessionsTable: schema.sessions,
        verificationTokensTable: schema.verificationTokens,
      }) as Adapter),
      createUser: user => {
        return db
          .insert(schema.users)
          .values({ ...user, id: nanoid() })
          .returning()
          .then(res => res[0]);
      },
    },
    providers: [
      Discord({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
      }),
    ],
    trustHost: true,
  };
});
