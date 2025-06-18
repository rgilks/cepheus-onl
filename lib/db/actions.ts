import { getDb } from 'lib/db';
import { generatedCharacters } from './schema';
import type { AIGeneratedCharacter } from '@/app/lib/domain/types/cepheus';

export const saveGeneratedCharacter = async (
  character: AIGeneratedCharacter,
  r2ImageKey: string | null
): Promise<void> => {
  const db = await getDb();
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
