import { ApplicationCommandOptionType } from 'discord-api-types/v10';

export const command = {
  name: 'world',
  description: 'Get information about a world from the Traveller Map.',
  options: [
    {
      name: 'sector',
      description: 'The sector abbreviation (e.g., spin for Spinward Marches).',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'hex',
      description: 'The 4-digit hex coordinate (e.g., 1910).',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
