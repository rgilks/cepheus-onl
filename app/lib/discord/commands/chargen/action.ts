import {
  type APIApplicationCommandInteractionDataStringOption,
  type APIChatInputApplicationCommandInteraction,
  MessageFlags,
} from 'discord-api-types/v10';
import { Race, Races } from '@/app/lib/domain/types/character';
import {
  formatCharacter,
  formatLocation,
  generateAndSaveCharacter,
  generatePlanetImagePrompt,
} from '@/app/lib/actions/chargen';
import { generateImage } from '@/app/lib/ai/google';
import { type TravellerWorld } from '@/app/lib/domain/types/travellermap';
import { type AIGeneratedCharacter } from '@/app/lib/domain/types/cepheus';

export const action = async (interaction: APIChatInputApplicationCommandInteraction) => {
  const sendFollowup = async (payload: object, image?: Uint8Array) => {
    const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;
    const formData = new FormData();
    formData.append('payload_json', JSON.stringify(payload));

    if (image && 'attachments' in payload && payload.attachments) {
      formData.append(
        'files[0]',
        new Blob([image]),
        (payload.attachments as { filename: string }[])[0].filename
      );
    }

    const response = await fetch(followupUrl, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      console.error('Failed to send followup to Discord:', await response.json());
    }
  };

  const sendError = async (message: string) => {
    await sendFollowup({
      content: message,
      flags: MessageFlags.Ephemeral,
    });
  };

  try {
    const raceOption = interaction.data.options?.[0] as
      | APIApplicationCommandInteractionDataStringOption
      | undefined;
    const race = (raceOption?.value as Race) ?? Races[Math.floor(Math.random() * Races.length)];
    const userId = interaction.member?.user.id;

    if (!userId) {
      return await sendError('Could not identify user.');
    }

    const savedCharacter = await generateAndSaveCharacter(race);
    if (!savedCharacter) {
      return await sendError('Failed to save character.');
    }
    const location = savedCharacter.location as TravellerWorld;
    const characterImage =
      savedCharacter.image && typeof savedCharacter.image === 'string'
        ? await generateImage(savedCharacter.image)
        : undefined;

    const characterContent = {
      content: formatCharacter(savedCharacter as AIGeneratedCharacter),
      ...{
        attachments: [
          {
            id: 0,
            filename: `${savedCharacter.name}.png`,
          },
        ],
      },
    };
    await sendFollowup(characterContent, characterImage);

    const locationContent = {
      embeds: [formatLocation(location)],
      ...{
        attachments: [
          {
            id: 0,
            filename: `${location.Name}.png`,
          },
        ],
      },
    };
    const locationImage = await generateImage(generatePlanetImagePrompt(location));
    await sendFollowup(locationContent, locationImage);
  } catch (error) {
    console.error(error);
    await sendError('An error occurred while generating the character.');
  }
};
