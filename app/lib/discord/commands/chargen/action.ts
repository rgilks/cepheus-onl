import { getCloudflareContext } from '@opennextjs/cloudflare';
import { generateImage, generateTextCompletion } from '@/app/lib/ai/google';
import { CepheusSchema, type Cepheus, type CepheusCareer } from '@/app/lib/domain/types/cepheus';
import { archetypes } from './archetypes';
import { nanoid } from 'nanoid';
import { saveGeneratedCharacter } from '@/lib/db/actions';
import {
  ApplicationCommandOptionType,
  type APIApplicationCommandInteractionDataStringOption,
  type APIChatInputApplicationCommandInteraction,
  type APIApplicationCommandInteractionDataOption,
} from 'discord-api-types/v10';
import { Race } from '@/app/lib/domain/types/character';
import { raceDescriptions } from '@/app/lib/domain/race-descriptions';
import { travellerMapClient } from '@/app/lib/travellermap/client';
import { TravellerWorld } from '@/app/lib/domain/types/travellermap';

const generatePrompt = (race: Race) => {
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
      "name": "string (A cool and evocative name suitable for the Traveller RPG setting. Avoid common or generic names like 'Vance'.)",
      "upp": "string (The Universal Personality Profile of the character, 6 characters, hex values 0-F)",
      "age": "number (The age of the character in years.)",
      "careers": [
        {
          "name": "string (The name of the career.)",
          "terms": "number (The number of terms served in the career.)"
        }
      ],
      "credits": "number (The amount of credits the character possesses.)",
      "skills": [
        {
          "name": "string",
          "level": "number"
        }
      ],
      "speciesTraits": "string[] | null (A list of traits for non-human species. Omit, set to null or an empty array if not applicable.)",
      "equipment": "string[] | null (A list of significant equipment the character owns. Omit, set to null or an empty array if not applicable.)",
      "backstory": "string (A short, engaging backstory for the character, suitable for a Cepheus Engine RPG setting.)"
    }
    \`\`\`

    Ensure the generated character is interesting and feels like a real person in a sci-fi universe.
    The backstory should be interesting, but very short - a single concise paragraph at most.
  `;
};

const generateImagePrompt = (character: Cepheus, race: Race): string => {
  const { age, careers, equipment } = character;
  const description = raceDescriptions[race];

  const careerDesc = careers.map((c: CepheusCareer) => c.name).join(', ');
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

const extractJsonFromAiResponse = (text: string): string | null => {
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

const formatCharacter = (character: Cepheus, location: TravellerWorld | null): string => {
  const { name, upp, age, careers, credits, skills, speciesTraits, equipment, backstory } =
    character;
  const careerString = careers.map((c: CepheusCareer) => `${c.name} (${c.terms} terms)`).join(', ');

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

  if (location) {
    const travellerMapLink = `https://travellermap.com/map?sector=${location.Sector}&hex=${location.Hex}`;
    parts.push(
      `\nCurrent Location: ${location.Name} (${location.UWP}) - ${location.Sector} ${location.Hex}`
    );
    parts.push(travellerMapLink);
  }

  return `\`\`\`\n${parts.join('\n')}\n\`\`\``;
};

const parseAndValidateCharacter = (jsonString: string): Cepheus => {
  try {
    const parsedJson = JSON.parse(jsonString);
    const validationResult = CepheusSchema.safeParse(parsedJson);

    if (!validationResult.success) {
      console.error('AI response validation failed:', validationResult.error.flatten());
      console.error('Parsed JSON was:', parsedJson);
      throw new Error('AI response validation failed.');
    }

    return validationResult.data;
  } catch (error) {
    console.error(
      'Failed to parse or validate JSON from AI response:',
      jsonString,
      'Error:',
      error
    );
    if (error instanceof Error && !error.message.includes('AI response')) {
      throw new Error('Failed to parse JSON from AI response.');
    }
    throw error;
  }
};

const generateCharacterData = async (race: Race): Promise<Cepheus> => {
  const prompt = generatePrompt(race);
  const aiResponseText = await generateTextCompletion(prompt);
  const jsonString = extractJsonFromAiResponse(aiResponseText);

  if (!jsonString) {
    console.error('AI response does not contain a valid JSON block:', aiResponseText);
    throw new Error('AI response is not in the expected JSON format.');
  }

  return parseAndValidateCharacter(jsonString);
};

export const action = async (interaction: APIChatInputApplicationCommandInteraction) => {
  const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`;

  const sendFollowup = async (content: string, image?: Uint8Array) => {
    const formData = new FormData();
    const payload = {
      content,
      embeds: image ? [{ image: { url: 'attachment://character.png' } }] : [],
      attachments: image ? [{ id: 0, filename: 'character.png' }] : [],
    };
    formData.append('payload_json', JSON.stringify(payload));

    if (image) {
      formData.append('files[0]', new Blob([image]), 'character.png');
    }

    await fetch(followupUrl, {
      method: 'PATCH',
      body: formData,
    });
  };

  const sendError = async (message: string) => {
    await fetch(followupUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });
  };

  try {
    const raceOption = interaction.data.options?.find(
      (option: APIApplicationCommandInteractionDataOption) =>
        option.name === 'race' && option.type === ApplicationCommandOptionType.String
    ) as APIApplicationCommandInteractionDataStringOption;

    if (!raceOption) {
      throw new Error('Race not provided.');
    }
    const race = raceOption.value as Race;

    console.log(`[Chargen] Starting character generation for race: ${race}...`);
    const character = await generateCharacterData(race);
    console.log('[Chargen] Character data generated successfully.');

    const spinwardMarchesWorlds = await travellerMapClient.getSectorWorlds('Spinward Marches');
    const location =
      spinwardMarchesWorlds[Math.floor(Math.random() * spinwardMarchesWorlds.length)] ?? null;

    const formattedCharacter = formatCharacter(character, location);

    if (process.env.IMAGE_GENERATION_ENABLED === 'true') {
      const imagePrompt = generateImagePrompt(character, race);
      const image = await generateImage(imagePrompt);

      console.log(`[Chargen] Received image data. Type: ${typeof image}, Length: ${image.length}`);
      if (!(image instanceof Uint8Array) || image.length === 0) {
        throw new Error('Generated image data is invalid or empty.');
      }

      await sendFollowup(formattedCharacter, image);
      console.log('[Chargen] Follow-up message sent successfully.');

      try {
        console.log('[Chargen] Uploading character image to R2...');
        const key = nanoid();
        const { env } = getCloudflareContext();
        await env.R2_IMAGES_BUCKET.put(key, image, {
          httpMetadata: { contentType: 'image/png' },
        });
        console.log(`[Chargen] Successfully uploaded character image to R2 with key: ${key}`);
        await saveGeneratedCharacter(character, key);
      } catch (r2Error) {
        console.error('[Chargen] Failed to upload image to R2:', r2Error);
      }
    } else {
      await sendFollowup(formattedCharacter);
      console.log('[Chargen] Follow-up message sent successfully.');
      await saveGeneratedCharacter(character, null);
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    await sendError(`Character generation failed: \`\`\`${errorMessage}\`\`\``);
  }
};
