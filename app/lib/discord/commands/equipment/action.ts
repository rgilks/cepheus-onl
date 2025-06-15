import srd from 'data/cepheus-engine-srd.json';
import {
  type APIApplicationCommandInteraction,
  type APIMessageComponentInteraction,
  InteractionResponseType,
  MessageFlags,
  type RESTPostAPIInteractionFollowupJSONBody,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import { NextResponse } from 'next/server';
import { discord } from 'app/lib/discord/discord';
import { EquipmentItemSchema } from 'app/lib/domain/types';

const EQUIPMENT_CATEGORIES = {
  armor: srd.armor,
  communicators: srd.communicators,
  computers: srd.computers,
  software: srd.software,
  drugs: srd.drugs,
  explosives: srd.explosives,
  personalDevices: srd.personalDevices,
  sensoryAids: srd.sensoryAids,
  shelters: srd.shelters,
  survivalEquipment: srd.survivalEquipment,
  toolKits: srd.toolKits,
  meleeWeapons: srd.meleeWeapons,
  rangedWeapons: srd.rangedWeapons,
  ammo: srd.ammo,
  accessories: srd.accessories,
  grenades: srd.grenades,
  heavyWeapons: srd.heavyWeapons,
};

type EquipmentCategory = keyof typeof EQUIPMENT_CATEGORIES;

function isEquipmentCategory(category: string): category is EquipmentCategory {
  return category in EQUIPMENT_CATEGORIES;
}

const createMessagePayload = (category: EquipmentCategory, page: number) => {
  const items = EQUIPMENT_CATEGORIES[category];
  const totalPages = items.length;
  const item = EquipmentItemSchema.parse(items[page]);

  if (!item) {
    return {
      content: 'Invalid item page.',
      flags: MessageFlags.Ephemeral,
    };
  }

  const stats = Object.entries(item)
    .filter(
      ([key]) =>
        key.toLowerCase() !== 'name' &&
        key.toLowerCase() !== 'category' &&
        key.toLowerCase() !== 'description'
    )
    .map(([key, value]) => `**${key}:** ${value}`)
    .join(' | ');

  const description = `${stats}${item.Description ? `\n\n*${item.Description}*` : ''}`;

  return {
    embeds: [
      {
        title: item.Name,
        description,
        footer: {
          text: `Page ${page + 1} of ${totalPages}`,
        },
      },
    ],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 1,
            label: 'Previous',
            custom_id: `equipment_${category}_${page - 1}`,
            disabled: page === 0,
          },
          {
            type: 2,
            style: 1,
            label: 'Next',
            custom_id: `equipment_${category}_${page + 1}`,
            disabled: page >= totalPages - 1,
          },
        ],
      },
    ],
    flags: MessageFlags.Ephemeral,
  };
};

export const action = async (interaction: APIApplicationCommandInteraction) => {
  if (interaction.data.name === 'equipment' && 'options' in interaction.data) {
    const option = interaction.data.options?.[0];
    if (option?.type === ApplicationCommandOptionType.String) {
      const category = option.value;
      if (typeof category === 'string' && isEquipmentCategory(category)) {
        const message = createMessagePayload(category, 0);
        await discord.createFollowupMessage(
          interaction.application_id,
          interaction.token,
          message as RESTPostAPIInteractionFollowupJSONBody
        );
        return;
      }
    }
  }

  await discord.createFollowupMessage(interaction.application_id, interaction.token, {
    content: 'Invalid equipment category',
    flags: MessageFlags.Ephemeral,
  });
};

export const handleComponentInteraction = (interaction: APIMessageComponentInteraction) => {
  if (interaction.data.custom_id?.startsWith('equipment_')) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, category, pageStr] = interaction.data.custom_id.split('_');
    const page = parseInt(pageStr, 10);
    if (isEquipmentCategory(category)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { flags, ...messageData } = createMessagePayload(category, page);
      return NextResponse.json({
        type: InteractionResponseType.UpdateMessage,
        data: messageData,
      });
    }
  }

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: 'Invalid interaction.',
      flags: MessageFlags.Ephemeral,
    },
  });
};
