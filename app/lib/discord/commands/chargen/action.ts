import { generateTextCompletion } from 'app/lib/ai/google';
import { CepheusSchema, type Cepheus } from '../../../domain/types/cepheus';

const generatePrompt = () => {
  const archetypes = [
    'A grizzled veteran of a long-forgotten war.',
    'A naive farmhand from a backwater planet on their first trip off-world.',
    'A slick corporate agent with a hidden agenda.',
    "A disgraced noble looking to reclaim their family's honor.",
    'An inquisitive scientist obsessed with a strange cosmic anomaly.',
    'A hard-bitten mercenary who only cares about the next paycheck.',
    'A devout cleric of a strange space cult.',
    'An ex-criminal trying to go straight, but their past keeps catching up.',
    'A flamboyant artist looking for inspiration in the stars.',
    'A jaded law enforcement officer from a high-tech metropolis.',
    'A star-ship chef who has seen too much.',
    'A washed-up journalist chasing one last big story.',
    'An idealistic diplomat trying to broker peace on the frontier.',
    'A genetically engineered former soldier seeking a new purpose.',
    'A rogue AI in a synthetic body, hiding its true nature.',
    'A seasoned cargo hauler who knows all the shortcuts and shady ports.',
    'A desperate refugee fleeing a planetary disaster.',
    'A grizzled prospector who struck it rich and is now hopelessly paranoid.',
    'A celebrity musician on a tour of the outer rim, secretly a spy.',
    'A former teacher who now leads a band of renegade students.',
    'A con artist who specializes in selling fake alien artifacts.',
    'A bounty hunter who always brings their target in alive, no matter the cost.',
    'A gambler who owes money to a powerful crime syndicate.',
    'A xenobotanist searching for a rare plant with miraculous healing properties.',
    'An archaeologist who unearthed a dangerous secret about a precursor race.',
    "A ship's doctor with a dark past and a steady hand in a crisis.",
    "A grizzled space marine who's seen too many battles.",
    'A smooth-talking diplomat from a minor noble house.',
    'A tech-savvy smuggler with a custom-built, high-speed freighter.',
    'A wanderer with amnesia, trying to piece together their identity from cryptic clues.',
    'A prophet who preaches about the end of the universe.',
    'A master thief who only steals from the ultra-wealthy.',
    'A retired starship captain, bored with civilian life.',
    'A cybernetically enhanced assassin trying to escape their former masters.',
    'A charismatic cult leader who promises eternal life through technology.',
    'A private investigator who specializes in missing persons cases on sprawling space stations.',
    'A struggling colonist on a newly terraformed world.',
    'A seasoned explorer mapping the uncharted regions of the galaxy.',
    'A bodyguard for a high-profile client with many enemies.',
    'A mechanic who can fix any ship with just a wrench and some colorful language.',
  ];

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
