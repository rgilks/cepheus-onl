import { Routes } from 'discord-api-types/v10';

export const sendMessage = async (channelId: string, message: string) => {
  const url = `https://discord.com/api/v10${Routes.channelMessages(channelId)}`;
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token) {
    throw new Error('Missing DISCORD_BOT_TOKEN');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error sending message to Discord:', errorData);
      throw new Error(`Discord API responded with status ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send message to Discord:', error);
    throw error;
  }
};
