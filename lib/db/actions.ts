import { getDb } from 'lib/db';
import { generatedCharacters } from './schema';
import type { AIGeneratedCharacter } from '@/app/lib/domain/types/cepheus';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

type CharacterInput = AIGeneratedCharacter & {
  image?: string;
  location: unknown;
  race: string;
  owner?: string;
};

export const saveGeneratedCharacter = async (character: CharacterInput) => {
  const db = await getDb();
  const id = nanoid();

  const dataToInsert = {
    id,
    name: character.name,
    race: character.race,
    description: character.backstory ?? '',
    story: character.backstory ?? '',
    stats: {
      upp: character.upp,
      age: character.age,
      credits: character.credits,
    },
    skills: character.skills,
    equipment: character.equipment ?? [],
    image: character.image,
    location: character.location,
    owner: character.owner,
  };

  await db.insert(generatedCharacters).values(dataToInsert);

  const newCharacter = await db
    .select()
    .from(generatedCharacters)
    .where(eq(generatedCharacters.id, id))
    .get();

  return newCharacter;
};
