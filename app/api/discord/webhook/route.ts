import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import { NextResponse, type NextRequest } from 'next/server';
import { action as chargenAction } from 'app/lib/discord/commands/chargen/action';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const rawBody = await request.text();

  const publicKey = process.env.DISCORD_APP_PUBLIC_KEY as string;
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

  const interaction = JSON.parse(rawBody);

  if (interaction.type === InteractionType.PING) {
    return NextResponse.json({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const { name } = interaction.data;

    if (name === 'hello') {
      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Hello there!',
        },
      });
    }

    if (name === 'chargen') {
      return chargenAction();
    }
  }

  return NextResponse.json({ error: 'Unhandled interaction type' }, { status: 400 });
}
