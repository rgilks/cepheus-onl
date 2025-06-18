import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { Races } from '@/app/lib/domain/types/character';

export const command = {
  name: 'chargen',
  description: 'Generates a random Cepheus Engine character.',
  options: [
    {
      name: 'race',
      description: 'The race of the character.',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: Races.map(race => ({ name: race, value: race })),
    },
  ],
};
