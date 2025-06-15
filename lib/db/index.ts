import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

export function getDb() {
  if (process.env.NODE_ENV === 'production') {
    const { env } = getCloudflareContext();
    return drizzle(env.DB, { schema });
  }

  const sqlite = new Database('local.db');
  return drizzleSqlite(sqlite, { schema });
}
