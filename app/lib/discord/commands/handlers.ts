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

type CloudflareContext = {
  waitUntil: (promise: Promise<unknown>) => void;
};

type CommandContext = { request: NextRequest; ctx: CloudflareContext };

type CommandHandler = (
  interaction: APIInteraction,
  context: CommandContext
) => Promise<NextResponse> | NextResponse;

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
  chargen: chargenHandler,
  equipment: equipmentHandler,
};
