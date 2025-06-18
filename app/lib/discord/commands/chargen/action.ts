import {
  type APIChatInputApplicationCommandInteraction,
  type APIApplicationCommandInteractionDataStringOption,
  MessageFlags,
} from 'discord-api-types/v10';
import { Race, Races } from '@/app/lib/domain/types/character';
import {
  formatCharacter,
  generateCharacterData,
  generateImagePrompt,
} from '@/app/lib/actions/chargen';
import { generateImage } from '@/app/lib/ai/google';

export const action = async (interaction: APIChatInputApplicationCommandInteraction) => {
  const sendFollowup = async (payload: object, image?: Uint8Array) => {
    const formData = new FormData();
    formData.append('payload_json', JSON.stringify(payload));
    if (image) {
      const attachment = (payload as { attachments: { id: number; filename: string }[] })
        .attachments[0];
      formData.append(`files[0]`, new Blob([image]), attachment.filename);
    }
    const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;
    await fetch(followupUrl, {
      method: 'POST',
      body: formData,
    });
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
    const raceValues = Object.values(Races);
    const race =
      (raceOption?.value as Race) ?? raceValues[Math.floor(Math.random() * raceValues.length)];

    await fetch(
      `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 5,
          data: {
            content: 'Generating character, please wait...',
            flags: MessageFlags.Ephemeral,
          },
        }),
      }
    );

    const characterData = await generateCharacterData(race);
    const imagePrompt = generateImagePrompt(characterData, race);
    const image = await generateImage(imagePrompt);

    const characterContent = {
      content: formatCharacter(characterData),
      attachments: [{ id: 0, filename: `${characterData.name}.png` }],
    };
    await sendFollowup(characterContent, image);
  } catch (error) {
    console.error('Error in chargen command:', error);
    await sendError('Failed to generate character. Please try again later.');
  }
};
