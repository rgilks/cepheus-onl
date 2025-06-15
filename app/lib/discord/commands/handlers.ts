import { action as chargenAction } from 'app/lib/discord/commands/chargen/action';
import {
  action as equipmentAction,
  handleComponentInteraction as equipmentComponentInteraction,
} from 'app/lib/discord/commands/equipment/action';
import {
  InteractionResponseType,
  InteractionType,
  type APIApplicationCommandInteraction,
  type APIInteraction,
  MessageFlags,
  type APIMessageComponentInteraction,
} from 'discord-api-types/v10';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CommandContext = { request: NextRequest; ctx: any };

type CommandHandler = (
  interaction: APIInteraction,
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
  ctx.waitUntil(chargenAction(interaction as APIApplicationCommandInteraction));
  return NextResponse.json({
    type: InteractionResponseType.DeferredChannelMessageWithSource,
    data: {
      flags: MessageFlags.Ephemeral,
    },
  });
};

const equipmentHandler: CommandHandler = (interaction, { ctx }) => {
  if (interaction.type === InteractionType.MessageComponent) {
    return equipmentComponentInteraction(interaction as APIMessageComponentInteraction);
  }

  ctx.waitUntil(equipmentAction(interaction as APIApplicationCommandInteraction));
  return NextResponse.json({
    type: InteractionResponseType.DeferredChannelMessageWithSource,
    data: {
      flags: MessageFlags.Ephemeral,
    },
  });
};

export const commandHandlers: Record<string, CommandHandler> = {
  hello: helloHandler,
  chargen: chargenHandler,
  equipment: equipmentHandler,
};
