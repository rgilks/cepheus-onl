import { generateImage, generateTextCompletion } from '@/app/lib/ai/google';
import {
  type AIGeneratedCharacter,
  AIGeneratedCharacterSchema,
  type AICareer,
} from '@/app/lib/domain/types/cepheus';
import { archetypes } from '@/app/lib/discord/commands/chargen/archetypes';
import { Race } from '@/app/lib/domain/types/character';
import { raceDescriptions } from '@/app/lib/domain/race-descriptions';
import { travellerMapClient } from '@/app/lib/travellermap/client';
import { TravellerWorld } from '@/app/lib/domain/types/travellermap';
import { saveImage } from '@/app/lib/actions/images';
import { saveGeneratedCharacter } from '@/lib/db/actions';
import { z } from 'zod';

export const generatePrompt = (race: Race) => {
  const randomArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];

  return `
    Please generate a random character for the Cepheus Engine RPG, based on the following concept:
    **${randomArchetype}**
    The character's race is **${race}**.

    The character should be in the standard Cepheus Engine format and include a short, engaging backstory that reflects the provided concept and race.
    The output must be a JSON object that conforms to the following Zod schema.
    IMPORTANT: The output MUST be a valid JSON object. Ensure that any double quotes within string values are properly escaped with a backslash (e.g., "This is a \\"quoted\\" string.").

    \`\`\`json
    {
      "name": "string",
      "upp": "string",
      "age": "number",
      "careers": [
        {
          "name": "string",
          "terms": "number"
        }
      ],
      "credits": "number",
      "skills": [
        {
          "name": "string",
          "level": "number"
        }
      ],
      "speciesTraits": "string[] | null",
      "equipment": "string[] | null",
      "backstory": "string"
    }
    \`\`\`

    Ensure the generated character is interesting and feels like a real person in a sci-fi universe.
    The backstory should be interesting, but very short - a single concise paragraph at most.
  `;
};

export const generateImagePrompt = (character: AIGeneratedCharacter, race: Race): string => {
  const { age, careers, equipment } = character;
  const description = raceDescriptions[race];

  const careerDesc = careers.map((c: AICareer) => c.name).join(', ');
  const equipmentList =
    equipment && equipment.length > 0 ? `Equipped with ${equipment.join(', ')}.` : '';

  const prompt = `
    Cinematic, photorealistic film still from a gritty, low-fi 1970s science fiction movie.
    A portrait of a ${age}-year-old ${race} who is a ${careerDesc}. ${equipmentList}
    The character's appearance is as follows: ${description}.
    The image should be utilitarian and grounded, with functional, well-used technology and clothing, not sleek or fantastical.
    The lighting is dramatic and high-contrast, with a grainy film texture. The colors are slightly faded and desaturated.
    The image must be clean and contain absolutely no text, letters, titles, logos, watermarks, UI elements, or any other kind of typography.
  `.trim();

  return prompt;
};

export const extractJsonFromAiResponse = (text: string): string | null => {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(jsonRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  const trimmedText = text.trim();
  if (
    (trimmedText.startsWith('{') && trimmedText.endsWith('}')) ||
    (trimmedText.startsWith('[') && trimmedText.endsWith(']'))
  ) {
    return trimmedText;
  }

  return null;
};

export const formatCharacter = (character: AIGeneratedCharacter): string => {
  const { name, upp, age, careers, credits, skills, speciesTraits, equipment, backstory } =
    character;
  const careerString = careers.map((c: AICareer) => `${c.name} (${c.terms} terms)`).join(', ');

  const sortedSkills = [...skills]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(s => `${s.name}-${s.level}`)
    .join(', ');

  const parts: string[] = [];
  parts.push(`${name}\t${upp}\tAge ${age}`);
  parts.push(`${careerString}\tCr${credits.toLocaleString()}`);
  parts.push(sortedSkills);

  if (speciesTraits && speciesTraits.length > 0) {
    parts.push(speciesTraits.join(', '));
  }

  if (equipment && equipment.length > 0) {
    parts.push(equipment.join(', '));
  }

  if (backstory) {
    parts.push(`\n${backstory}`);
  }

  return `\`\`\`\n${parts.join('\n')}\n\`\`\``;
};

export const uwpToDescriptors = (uwp: string) => {
  const parts = uwp.split('-');
  const mainProfile = parts[0];

  const descriptors = [];

  const starportMap: Record<string, string> = {
    A: 'Excellent Starport',
    B: 'Good Starport',
    C: 'Routine Starport',
    D: 'Poor Starport',
    E: 'Frontier Starport',
    X: 'No Starport',
  };
  if (starportMap[mainProfile[0]]) descriptors.push(starportMap[mainProfile[0]]);

  const size = parseInt(mainProfile[1], 16);
  if (size === 0) descriptors.push('asteroid belt');
  else if (size <= 2) descriptors.push('tiny world');
  else if (size <= 5) descriptors.push('small world');
  else if (size <= 8) descriptors.push('medium-sized world');
  else descriptors.push('large world');

  const atmosphere = parseInt(mainProfile[2], 16);
  const atmosphereMap: Record<number, string> = {
    0: 'no atmosphere',
    1: 'trace atmosphere',
    2: 'very thin, tainted atmosphere',
    3: 'very thin atmosphere',
    4: 'thin, tainted atmosphere',
    5: 'thin atmosphere',
    6: 'standard atmosphere',
    7: 'dense, tainted atmosphere',
    8: 'dense atmosphere',
    9: 'exotic atmosphere',
    10: 'corrosive atmosphere',
    11: 'insidious atmosphere',
    12: 'dense, high-pressure atmosphere',
  };
  if (atmosphereMap[atmosphere]) descriptors.push(atmosphereMap[atmosphere]);

  const hydro = parseInt(mainProfile[3], 16);
  if (hydro === 0) descriptors.push('a desert world');
  else if (hydro <= 2) descriptors.push('with some surface water');
  else if (hydro <= 5) descriptors.push('with significant oceans and continents');
  else if (hydro <= 9) descriptors.push('with small continents and vast oceans');
  else descriptors.push('a water world with few islands');

  const population = parseInt(mainProfile[4], 16);
  if (population === 0) descriptors.push('uninhabited');
  else if (population <= 3) descriptors.push('a very low population');
  else if (population <= 6) descriptors.push('a medium population');
  else if (population <= 9) descriptors.push('a high population');
  else descriptors.push('an extremely high population');

  if (parts.length > 1) {
    const techLevel = parseInt(parts[1], 16);
    if (techLevel <= 5) descriptors.push('low technology');
    else if (techLevel <= 8) descriptors.push('average industrial technology');
    else if (techLevel <= 11) descriptors.push('advanced technology');
    else descriptors.push('very advanced, star-faring technology');
  }

  return descriptors;
};

export const generatePlanetImagePrompt = (world: TravellerWorld): string => {
  const { Name, UWP, Remarks } = world;
  const descriptors = uwpToDescriptors(UWP ?? '');

  const basePrompt = `
      Breathtaking digital painting of a planetary vista from space.
      The planet is named ${Name}. It is ${descriptors.join(', ')}.
      The view from a spaceship window, showing a part of the ship's hull in the foreground for scale.
      The lighting is cinematic and dramatic, with strong highlights and deep shadows from its parent star.
      Visible details could include continent shapes, cloud patterns, polar ice caps, and city lights on the night side if populated.
      If the world is an asteroid belt, show a dense field of asteroids with a mining outpost visible.
      If it's a gas giant, show swirling bands of colorful clouds and massive storms.
      The image should be awe-inspiring and evoke a sense of wonder and exploration.
      The image must be clean and contain absolutely no text, letters, titles, logos, watermarks, UI elements, or any other kind of typography.
      `;

  const notesPrompt = Remarks ? `Additional context about the world: ${Remarks}` : '';

  return `${basePrompt}\n${notesPrompt}`.trim();
};

export const formatLocation = (location: TravellerWorld) => {
  const { Name, UWP, Hex, Sector, PBG, Allegiance, Remarks } = location;
  const link = `https://travellermap.com/go/${Sector.split(' ')[0].toLowerCase()}/${Hex}`;
  const fields = [
    { name: 'UWP', value: UWP ?? '???????-?', inline: true },
    { name: 'PBG', value: PBG ?? '???', inline: true },
    { name: 'Allegiance', value: Allegiance ?? '??', inline: true },
  ];

  const notes = Remarks?.replace(/<[^>]*>?/gm, '');
  if (notes) {
    fields.push({ name: 'Notes', value: notes, inline: false });
  }

  return {
    title: `${Name ?? 'Unknown World'} - ${Sector} ${Hex}`,
    description: `[View on Traveller Map](${link})`,
    color: 0x0099ff,
    fields,
  };
};

export const parseAndValidateCharacter = (jsonString: string): AIGeneratedCharacter => {
  try {
    const parsedJson = JSON.parse(jsonString);
    const validationResult = AIGeneratedCharacterSchema.safeParse(parsedJson);

    if (!validationResult.success) {
      console.error('AI response validation failed:', validationResult.error.flatten());
      console.error('Parsed JSON was:', parsedJson);
      throw new Error('AI response validation failed.');
    }

    return validationResult.data;
  } catch (error) {
    console.error('Error parsing and validating character JSON:', error);
    throw new Error('Failed to parse or validate character from AI response.');
  }
};

export const generateCharacterData = async (race: Race): Promise<AIGeneratedCharacter> => {
  const prompt = generatePrompt(race);
  const text = await generateTextCompletion(prompt);

  if (!text) {
    throw new Error('AI text generation failed.');
  }

  const json = extractJsonFromAiResponse(text);

  if (!json) {
    console.error('Failed to extract JSON from AI response:', text);
    throw new Error('Failed to extract JSON from AI response.');
  }

  return parseAndValidateCharacter(json);
};

export const generateAndSaveCharacter = async (race: Race) => {
  const characterData = await generateCharacterData(race);
  const imagePrompt = generateImagePrompt(characterData, race);
  const image = await generateImage(imagePrompt);

  const location = await pickRandomWorld();
  if (!location) {
    throw new Error('Could not find a suitable starting location.');
  }

  const r2ImageKey = image ? await saveImage(image) : null;
  const locationImage = await generateImage(generatePlanetImagePrompt(location));
  const locationImageKey = locationImage ? await saveImage(locationImage) : null;

  const characterWithImage = { ...characterData, image: imagePrompt };
  const validationResult = AIGeneratedCharacterSchema.extend({
    image: z.string().optional(),
  }).safeParse(characterWithImage);

  if (!validationResult.success) {
    throw new Error('Failed to validate character with image.');
  }

  return saveGeneratedCharacter(validationResult.data, r2ImageKey, location, locationImageKey);
};

export async function pickRandomWorld(): Promise<TravellerWorld | null> {
  for (let i = 0; i < 5; i++) {
    const randomSector = await travellerMapClient.getRandomSector();
    if (randomSector && randomSector.Name === 'Spinward Marches') {
      const worlds = await travellerMapClient.getSectorWorlds(randomSector.Name);
      if (worlds.length > 0) {
        const randomIndex = Math.floor(Math.random() * worlds.length);
        const selectedWorld = worlds[randomIndex];

        const worldDetails = await travellerMapClient.getWorldDetails(
          randomSector.Name,
          selectedWorld.Hex
        );
        if (worldDetails) return worldDetails;
      }
    }
  }
  return null;
}
