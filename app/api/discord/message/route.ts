import { sendMessage } from '@/lib/discord';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message } = await request.json();
  const channelId = process.env.DISCORD_CHANNEL_ID as string;

  if (!message || !channelId) {
    return NextResponse.json({ error: 'Missing message or channel ID' }, { status: 400 });
  }

  try {
    await sendMessage(channelId, message);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
