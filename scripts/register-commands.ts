import 'dotenv/config';
import { Routes, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { command as equipmentCommand } from 'app/lib/discord/commands/equipment/command';
import { command as worldCommand } from 'app/lib/discord/commands/traveller/command';
import { Races } from '../app/lib/domain/races';

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  throw new Error('Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID in .env.local');
}

const commands = [
  {
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
  },
  equipmentCommand,
  worldCommand,
];

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    const url = `https://discord.com/api/v10/${Routes.applicationCommands(clientId)}`;

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${token}`,
      },
      method: 'PUT',
      body: JSON.stringify(commands),
    });

    if (res.ok) {
      console.log('Successfully reloaded application (/) commands.');
    } else {
      console.error('Failed to reload application (/) commands.');
      const text = await res.text();
      console.error(text);
    }
  } catch (error) {
    console.error(error);
  }
})();
