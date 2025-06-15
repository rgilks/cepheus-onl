import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN as string);

export async function sendMessage(channelId: string, message: string) {
  try {
    await rest.post(Routes.channelMessages(channelId), {
      body: {
        content: message,
      },
    });
  } catch (error) {
    console.error('Error sending message to Discord:', error);
    throw error;
  }
}
