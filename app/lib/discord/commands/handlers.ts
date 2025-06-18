import { action as chargenAction } from 'app/lib/discord/commands/chargen/action';
import {
  action as equipmentAction,
  handleComponentInteraction as equipmentComponentInteraction,
} from 'app/lib/discord/commands/equipment/action';
import {
  action as newgameAction,
  handleComponentInteraction as newgameComponentInteraction,
} from 'app/lib/discord/commands/newgame/action';
import {
  InteractionResponseType,
  InteractionType,
  type APIApplicationCommandInteraction,
  type APIInteraction,
  MessageFlags,
  type APIMessageComponentInteraction,
  type APIChatInputApplicationCommandInteraction,
} from 'discord-api-types/v10';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { action as worldAction } from 'app/lib/discord/commands/traveller/world';

type CloudflareContext = {
  waitUntil: (promise: Promise<unknown>) => void;
};

type CommandContext = { request: NextRequest; ctx: CloudflareContext };

type CommandHandler = (
  interaction: APIInteraction,
  context: CommandContext
) => Promise<NextResponse> | NextResponse;

const chargenHandler: CommandHandler = (interaction, { ctx }) => {
  ctx.waitUntil(chargenAction(interaction as APIChatInputApplicationCommandInteraction));
  return NextResponse.json({
    type: InteractionResponseType.DeferredChannelMessageWithSource,
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

const worldHandler: CommandHandler = (interaction, { ctx }) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    ctx.waitUntil(worldAction(interaction as APIChatInputApplicationCommandInteraction));
    return NextResponse.json({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
      },
    });
  }
  return NextResponse.json({ error: 'Invalid interaction type' }, { status: 400 });
};

const newgameHandler: CommandHandler = async (interaction, { ctx }) => {
  if (interaction.type === InteractionType.MessageComponent) {
    ctx.waitUntil(newgameComponentInteraction(interaction as APIMessageComponentInteraction));
    return NextResponse.json({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
      },
    });
  }

  ctx.waitUntil(newgameAction(interaction as APIChatInputApplicationCommandInteraction));
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
  world: worldHandler,
  newgame: newgameHandler,
};
