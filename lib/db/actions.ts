import { getDb } from 'lib/db';
import { generatedCharacters } from './schema';
import type { AIGeneratedCharacter } from '@/app/lib/domain/types/cepheus';
import { TravellerWorld } from '@/app/lib/domain/types/travellermap';

export const saveGeneratedCharacter = async (
  character: AIGeneratedCharacter,
  r2ImageKey: string | null,
  location: TravellerWorld | null,
  locationImageKey: string | null
): Promise<void> => {
  const db = await getDb();
  try {
    console.log('[DB] Saving generated character...');
    await db.insert(generatedCharacters).values({
      ...character,
      r2_image_key: r2ImageKey,
      location,
      location_image_key: locationImageKey,
    });
    console.log('[DB] Successfully saved generated character.');
  } catch (error) {
    console.error('[DB] Failed to save generated character:', error);
  }
};
