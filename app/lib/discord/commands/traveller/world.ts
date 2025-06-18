import {
  type APIChatInputApplicationCommandInteraction,
  ApplicationCommandOptionType,
  type RESTPostAPIInteractionFollowupJSONBody,
  MessageFlags,
  InteractionType,
} from 'discord-api-types/v10';
import { discord } from 'app/lib/discord/discord';
import { travellerMapClient } from 'app/lib/travellermap/client';

export const action = async (interaction: APIChatInputApplicationCommandInteraction) => {
  if (
    !interaction.data.options ||
    !Array.isArray(interaction.data.options) ||
    interaction.type !== InteractionType.ApplicationCommand
  ) {
    await discord.createFollowupMessage(interaction.application_id, interaction.token, {
      content: 'Invalid interaction type for the command.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const sectorOption = interaction.data.options.find(opt => opt.name === 'sector');
  const hexOption = interaction.data.options.find(opt => opt.name === 'hex');

  if (
    !sectorOption ||
    sectorOption.type !== ApplicationCommandOptionType.String ||
    !hexOption ||
    hexOption.type !== ApplicationCommandOptionType.String
  ) {
    await discord.createFollowupMessage(interaction.application_id, interaction.token, {
      content: 'Invalid options for the command.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const sector = sectorOption.value;
  const hex = hexOption.value;

  try {
    const world = await travellerMapClient.getWorldDetails(sector, hex);

    if (!world) {
      await discord.createFollowupMessage(interaction.application_id, interaction.token, {
        content: `Could not find world data for ${sector} ${hex}.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const message = `
**World Data for ${world.Name} (${world.Hex}) in ${world.Sector} Sector**
**UWP:** ${world.UWP}
**Allegiance:** ${world.Allegiance}
**Bases:** ${world.Bases || 'None'}
**Zone:** ${world.Zone || 'None'}
**PBG:** ${world.PBG}
**Stellar:** ${world.Stellar}
**Remarks:** ${world.Remarks || 'None'}
    `.trim();

    await discord.createFollowupMessage(interaction.application_id, interaction.token, {
      content: message,
    } as RESTPostAPIInteractionFollowupJSONBody);
  } catch (error) {
    console.error('Error fetching world data from Traveller Map API:', error);
    await discord.createFollowupMessage(interaction.application_id, interaction.token, {
      content: 'An error occurred while fetching world data.',
      flags: MessageFlags.Ephemeral,
    });
  }
};
