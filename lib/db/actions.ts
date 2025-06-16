import { getDb } from 'lib/db';
import { generatedCharacters } from 'lib/db/schema';
import type { Cepheus } from 'app/lib/domain/types';

export const saveGeneratedCharacter = async (
  character: Cepheus,
  r2ImageKey: string
): Promise<void> => {
  const db = getDb();
  try {
    console.log('[DB] Saving generated character...');
    await db.insert(generatedCharacters).values({
      ...character,
      r2_image_key: r2ImageKey,
    });
    console.log('[DB] Successfully saved generated character.');
  } catch (error) {
    console.error('[DB] Failed to save generated character:', error);
  }
};
