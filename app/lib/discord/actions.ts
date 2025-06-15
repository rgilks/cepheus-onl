'use server';

import { sendMessage } from '@/lib/discord';
import { DiscordMessageSchema } from '../domain/types/discord';

export type FormState = {
  message: string;
  errors?: {
    message?: string[];
  };
};

export async function sendDiscordMessage(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = DiscordMessageSchema.safeParse({
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Message is required.',
    };
  }

  const channelId = process.env.DISCORD_CHANNEL_ID as string;
  if (!channelId) {
    return { message: 'Discord channel not configured.' };
  }

  try {
    await sendMessage(channelId, validatedFields.data.message);
    return { message: 'Message sent successfully.' };
  } catch {
    return { message: 'Failed to send message.' };
  }
}
