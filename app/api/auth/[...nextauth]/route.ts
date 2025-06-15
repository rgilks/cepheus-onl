import NextAuth, { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getDb } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { type NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import { Adapter, AdapterUser } from 'next-auth/adapters';

function CustomDrizzleAdapter(db: ReturnType<typeof getDb>): Adapter {
  const adapter = DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  });

  return {
    ...adapter,
    createUser: (user: Omit<AdapterUser, 'id'>) => {
      if (!adapter.createUser) {
        throw new Error('createUser is not implemented in the base adapter');
      }
      return adapter.createUser({ ...user, id: nanoid() });
    },
  };
}

function getAuthOptions(): NextAuthOptions {
  return {
    adapter: CustomDrizzleAdapter(getDb()),
    providers: [
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID as string,
        clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      }),
    ],
  };
}

async function handler(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  return NextAuth(req, ctx, getAuthOptions());
}

export { handler as GET, handler as POST };
