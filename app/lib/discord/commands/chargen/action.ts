import { generateTextCompletion } from 'app/lib/ai/google';
import { CepheusSchema, type Cepheus } from '../../../domain/types/cepheus';
import { NextResponse } from 'next/server';
import { InteractionResponseType } from 'discord-interactions';

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
    The backstory should be a few paragraphs long.
  `;
};

const formatCharacter = (character: Cepheus) => {
  const { name, upp, age, careers, credits, skills, speciesTraits, equipment, backstory } =
    character;
  const careerString = careers.map(c => `${c.name} (${c.terms} terms)`).join(', ');
  const skillString = skills.map(s => `${s.name}-${s.level}`).join(', ');

  let response = `**${name}**\t${upp}\tAge ${age}\n`;
  response += `${careerString}\tCr${credits.toLocaleString()}\n`;
  response += `${skillString}\n`;

  if (speciesTraits && speciesTraits.length > 0) {
    response += `${speciesTraits.join(', ')}\n`;
  }

  if (equipment && equipment.length > 0) {
    response += `${equipment.join(', ')}\n`;
  }

  response += `\n**Backstory**\n${backstory}`;

  return response;
};

export const action = async () => {
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
      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content:
            'Failed to generate a character. The AI response was not in the expected format.',
        },
      });
    }

    const character = validationResult.data;
    console.log('Generated character:', JSON.stringify(character, null, 2));
    const formattedCharacter = formatCharacter(character);
    console.log('Formatted character to be returned:', formattedCharacter);

    return NextResponse.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: formattedCharacter,
      },
    });
  } catch (error) {
    console.error('Error generating character:', error);
    return NextResponse.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'An error occurred while generating the character.',
      },
    });
  }
};
