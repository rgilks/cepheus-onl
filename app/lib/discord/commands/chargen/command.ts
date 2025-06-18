import { SlashCommandBuilder, type SlashCommandStringOption } from 'discord.js';
import { Races } from '@/app/lib/domain/types/character';

export const command = new SlashCommandBuilder()
  .setName('chargen')
  .setDescription('Generates a new character.')
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('race')
      .setDescription('The race of the character to generate.')
      .setRequired(false)
      .addChoices(...Object.values(Races).map(race => ({ name: race, value: race })))
  );
