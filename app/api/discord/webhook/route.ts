import { getCloudflareContext } from '@opennextjs/cloudflare';
import { commandHandlers } from 'app/lib/discord/commands/handlers';
import type { APIInteraction } from 'discord-api-types/v10';
import { InteractionResponseType, InteractionType } from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';
import { NextResponse, type NextRequest } from 'next/server';

const withDiscordVerification = (
  handler: (request: NextRequest, interaction: APIInteraction) => Promise<Response> | Response
) => {
  return async (request: NextRequest) => {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const rawBody = await request.clone().text();

    const publicKey = process.env.DISCORD_APP_PUBLIC_KEY;
    if (!publicKey) {
      console.error('DISCORD_APP_PUBLIC_KEY is not set.');
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    if (!signature || !timestamp) {
      return new NextResponse('Bad request signature', { status: 401 });
    }

    const isValid = await verifyKey(rawBody, signature, timestamp, publicKey);

    if (!isValid) {
      return new NextResponse('Bad request signature', { status: 401 });
    }

    const interaction = JSON.parse(rawBody) as APIInteraction;
    return handler(request, interaction);
  };
};

const handleInteraction = (request: NextRequest, interaction: APIInteraction) => {
  const { ctx } = getCloudflareContext();
  console.log('Received interaction:', JSON.stringify(interaction, null, 2));

  if (interaction.type === InteractionType.Ping) {
    return NextResponse.json({ type: InteractionResponseType.Pong });
  }

  let handler;
  if (interaction.type === InteractionType.ApplicationCommand) {
    handler = commandHandlers[interaction.data.name];
    console.log(`Routing to ApplicationCommand handler for: ${interaction.data.name}`);
  } else if (interaction.type === InteractionType.MessageComponent) {
    const commandName = interaction.data.custom_id.split('_')[0];
    handler = commandHandlers[commandName];
    console.log(`Routing to MessageComponent handler for: ${commandName}`);
  }

  if (handler) {
    return handler(interaction, { request, ctx });
  }

  console.error('No handler found for interaction');
  return NextResponse.json({ error: 'Unhandled interaction' }, { status: 400 });
};

export const POST = withDiscordVerification(handleInteraction);
