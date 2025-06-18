import { getDb } from 'lib/db';
import { generatedCharacters } from './schema';
import type { AIGeneratedCharacter } from '@/app/lib/domain/types/cepheus';
import { TravellerWorld } from '@/app/lib/domain/types/travellermap';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';

export const saveGeneratedCharacter = async (
  character: AIGeneratedCharacter,
  r2ImageKey: string | null,
  location: TravellerWorld | null,
  locationImageKey: string | null
) => {
  const db = await getDb();
  const data = {
    ...character,
    id: nanoid(),
    r2_image_key: r2ImageKey,
    location,
    location_image_key: locationImageKey,
  };
  await db.insert(generatedCharacters).values(data);

  return (
    db as DrizzleD1Database<typeof schema> | BetterSQLite3Database<typeof schema>
  ).query.generatedCharacters.findFirst({
    where: eq(generatedCharacters.id, data.id),
  });
};
