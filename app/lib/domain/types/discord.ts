import { z } from 'zod';

export const DiscordMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

export type DiscordMessage = z.infer<typeof DiscordMessageSchema>;
