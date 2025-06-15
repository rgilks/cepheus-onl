import { generateTextCompletion } from 'app/lib/ai/google';
import { CepheusSchema, type Cepheus } from '../../../domain/types/cepheus';

const generatePrompt = () => {
  return `
    Please generate a random character for the Cepheus Engine RPG.
    The character should be in the standard Cepheus Engine format and include a short, engaging backstory.
    The output must be a JSON object that conforms to the following Zod schema:

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
      "speciesTraits": "string[] | undefined (A list of traits for non-human species.)",
      "equipment": "string[] | undefined (A list of significant equipment the character owns.)",
      "backstory": "string (A short, engaging backstory for the character, suitable for a Cepheus Engine RPG setting.)"
    }
    \`\`\`

    Ensure the generated character is interesting and feels like a real person in a sci-fi universe.
    The backstory should be interesting, but very short - a single concise paragraph at most.
  `;
};

const formatCharacter = (character: Cepheus) => {
  const { name, upp, age, careers, credits, skills, speciesTraits, equipment, backstory } =
    character;
  const careerString = careers.map(c => `${c.name} (${c.terms} terms)`).join(', ');
  const skillString = skills.map(s => `${s.name}-${s.level}`).join(', ');

  let response = `-------------------\n\n${name}\t${upp}\tAge ${age}\n`;
  response += `${careerString}\tCr${credits.toLocaleString()}\n`;
  response += `${skillString}\n`;

  if (speciesTraits && speciesTraits.length > 0) {
    response += `${speciesTraits.join(', ')}\n`;
  }

  if (equipment && equipment.length > 0) {
    response += `\n${equipment.join(', ')}\n`;
  }

  const formattedBackstory = backstory.replace(/(?<!\n)\n(?!\n)/g, '\n\n');
  response += `\n${formattedBackstory}\n\n-------------------`;

  return response;
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
    const prompt = generatePrompt();
    const aiResponseText = await generateTextCompletion(prompt);

    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = aiResponseText.match(jsonRegex);
    let potentialJsonString: string;

    if (match && match[1]) {
      potentialJsonString = match[1].trim();
    } else {
      const trimmedText = aiResponseText.trim();
      if (
        (trimmedText.startsWith('{') && trimmedText.endsWith('}')) ||
        (trimmedText.startsWith('[') && trimmedText.endsWith(']'))
      ) {
        potentialJsonString = trimmedText;
      } else {
        console.error('AI response is not valid JSON:', aiResponseText);
        throw new Error('AI response is not in the expected JSON format.');
      }
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(potentialJsonString);
    } catch (parseError) {
      console.error(
        'Failed to parse JSON from AI response string:',
        potentialJsonString,
        'Error:',
        parseError
      );
      throw new Error('Failed to parse JSON from AI response.');
    }

    const validationResult = CepheusSchema.safeParse(parsedJson);

    if (!validationResult.success) {
      console.error('AI response validation failed:', validationResult.error.flatten());
      console.error('Parsed JSON was:', parsedJson);
      await sendFollowup(
        'Failed to generate a character. The AI response was not in the expected format.'
      );
      return;
    }

    const character = validationResult.data;
    console.log('Generated character:', JSON.stringify(character, null, 2));
    const formattedCharacter = formatCharacter(character);
    console.log('Formatted character to be returned:', formattedCharacter);

    await sendFollowup(formattedCharacter);
  } catch (error) {
    console.error('Error generating character:', error);
    await sendFollowup('An error occurred while generating the character.');
  }
};
