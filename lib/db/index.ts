import { getCloudflareContext } from '@opennextjs/cloudflare';
import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';

let db: DrizzleD1Database<typeof schema> | BetterSQLite3Database<typeof schema>;

export const getDb = () => {
  if (!db) {
    if (process.env.NODE_ENV === 'production') {
      const { env } = getCloudflareContext();
      if (!env.DB) {
        throw new Error('DB environment variable is not set.');
      }
      db = drizzle(env.DB, { schema });
    } else {
      const sqlite = new Database('local.db');
      db = drizzleSqlite(sqlite, { schema });
    }
  }

  return db;
};
