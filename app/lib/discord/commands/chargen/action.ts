import { generateTextCompletion } from 'app/lib/ai/google';
import { CepheusSchema, type Cepheus, type CepheusCareer } from '../../../domain/types';
import { archetypes } from './archetypes';

const generatePrompt = () => {
  const randomArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];

  return `
    Please generate a random character for the Cepheus Engine RPG, based on the following concept:
    **${randomArchetype}**

    The character should be in the standard Cepheus Engine format and include a short, engaging backstory that reflects the provided concept.
    The output must be a JSON object that conforms to the following Zod schema.
    IMPORTANT: The output MUST be a valid JSON object. Ensure that any double quotes within string values are properly escaped with a backslash (e.g., "This is a \\"quoted\\" string.").

    \`\`\`json
    {
      "name": "string (The full name of the character, including any titles.)",
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
      "speciesTraits": "string[] (A list of traits for non-human species. Omit or set to null if not applicable.)",
      "equipment": "string[] (A list of significant equipment the character owns. Omit or set to null if not applicable.)",
      "backstory": "string (A short, engaging backstory for the character, suitable for a Cepheus Engine RPG setting.)"
    }
    \`\`\`

    Ensure the generated character is interesting and feels like a real person in a sci-fi universe.
    The backstory should be interesting, but very short - a single concise paragraph at most.
  `;
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

const formatCharacter = (character: Cepheus): string => {
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

const generateCharacterData = async (): Promise<Cepheus> => {
  const prompt = generatePrompt();
  const aiResponseText = await generateTextCompletion(prompt);
  const jsonString = extractJsonFromAiResponse(aiResponseText);

  if (!jsonString) {
    console.error('AI response does not contain a valid JSON block:', aiResponseText);
    throw new Error('AI response is not in the expected JSON format.');
  }

  return parseAndValidateCharacter(jsonString);
};

export const action = async (interaction: { application_id: string; token: string }) => {
  const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`;

  const sendFollowup = async (content: string) => {
    await fetch(followupUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  };

  try {
    const character = await generateCharacterData();
    const formattedCharacter = formatCharacter(character);
    await sendFollowup(formattedCharacter);
  } catch (error) {
    console.error('Error generating character:', error);
    const errorMessage =
      error instanceof Error && error.message.includes('AI response')
        ? 'Failed to generate a character. The AI response was not in the expected format.'
        : 'An error occurred while generating the character.';
    await sendFollowup(errorMessage);
  }
};
