import { action as chargenAction } from 'app/lib/discord/commands/chargen/action';
import {
  InteractionResponseType,
  type APIApplicationCommandInteraction,
} from 'discord-api-types/v10';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CommandContext = { request: NextRequest; ctx: any };

type CommandHandler = (
  interaction: APIApplicationCommandInteraction,
  context: CommandContext
) => Promise<NextResponse> | NextResponse;

const helloHandler: CommandHandler = () => {
  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: 'Hello there!',
    },
  });
};

const chargenHandler: CommandHandler = (interaction, { ctx }) => {
  ctx.waitUntil(chargenAction(interaction));
  return NextResponse.json({
    type: InteractionResponseType.DeferredChannelMessageWithSource,
  });
};

export const commandHandlers: Record<string, CommandHandler> = {
  hello: helloHandler,
  chargen: chargenHandler,
};
