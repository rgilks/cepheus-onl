import NextAuth, { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getDb } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { nanoid } from 'nanoid';
import { Adapter, AdapterUser } from 'next-auth/adapters';
import { NextRequest } from 'next/server';

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

export const GET = (req: NextRequest, ctx: { params: { nextauth: string[] } }) =>
  NextAuth(req, ctx, getAuthOptions());

export const POST = (req: NextRequest, ctx: { params: { nextauth: string[] } }) =>
  NextAuth(req, ctx, getAuthOptions());
