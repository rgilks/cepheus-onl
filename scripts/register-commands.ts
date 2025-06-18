// Register discord commands
import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { command as chargenCommand } from '@/app/lib/discord/commands/chargen/command';
import { command as equipmentCommand } from '@/app/lib/discord/commands/equipment/command';
import { command as worldCommand } from '@/app/lib/discord/commands/traveller/command';
import { command as newgameCommand } from '@/app/lib/discord/commands/newgame/command';

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  throw new Error('Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID in .env.local');
}

const commands = [chargenCommand, equipmentCommand, worldCommand, newgameCommand];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
