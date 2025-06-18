import {
  type APIChatInputApplicationCommandInteraction,
  type APIMessageComponentInteraction,
  MessageFlags,
  ComponentType,
  ButtonStyle,
  ChannelType,
} from 'discord-api-types/v10';
import { getDb } from '@/lib/db';
import { discordGames, generatedCharacters } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  formatCharacter,
  generateAndSaveCharacter,
  formatLocation,
  generatePlanetImagePrompt,
} from '@/app/lib/actions/chargen';
import { Races } from '@/app/lib/domain/types/character';
import { generateImage } from '@/app/lib/ai/google';
import { AIGeneratedCharacter } from '@/app/lib/domain/types/cepheus';
import { TravellerWorld } from '@/app/lib/domain/types/travellermap';
import { nanoid } from 'nanoid';

export const action = async (interaction: APIChatInputApplicationCommandInteraction) => {
  const sendFollowup = async (payload: object) => {
    const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;
    await fetch(followupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  const sendError = async (message: string) => {
    await sendFollowup({
      content: message,
      flags: MessageFlags.Ephemeral,
    });
  };

  const userId = interaction.member?.user.id;
  if (!userId) {
    return await sendError('Could not identify you.');
  }

  const db = await getDb();

  const existingGame = await db
    .select()
    .from(discordGames)
    .where(eq(discordGames.discordUserId, userId))
    .get();

  if (existingGame && existingGame.isActive) {
    return await sendError(
      'You already have an active game. Please end your current game before starting a new one.'
    );
  }

  await sendFollowup({
    content: 'Generating characters, please wait...',
    flags: MessageFlags.Ephemeral,
  });

  const characters = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      generateAndSaveCharacter(Races[Math.floor(Math.random() * Races.length)])
    )
  );

  const components = characters
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .map(character => ({
      type: ComponentType.Button,
      style: ButtonStyle.Primary,
      label: character.name,
      custom_id: `newgame_select_${character.id}`,
    }));

  await sendFollowup({
    content: 'Please select a character to begin your adventure:',
    flags: MessageFlags.Ephemeral,
    components: [{ type: ComponentType.ActionRow, components }],
  });
};

export const handleComponentInteraction = async (interaction: APIMessageComponentInteraction) => {
  const sendFollowup = async (payload: object) => {
    const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;
    await fetch(followupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  const sendError = async (message: string) => {
    await sendFollowup({
      content: message,
      flags: MessageFlags.Ephemeral,
    });
  };

  const userId = interaction.member?.user.id;
  if (!userId) {
    return await sendError('Could not identify you.');
  }

  const customId = interaction.data.custom_id;
  if (!customId.startsWith('newgame_select_')) {
    return;
  }

  const characterId = customId.replace('newgame_select_', '');

  const db = await getDb();
  const character = await db
    .select()
    .from(generatedCharacters)
    .where(eq(generatedCharacters.id, characterId))
    .get();

  if (!character) {
    return await sendError('Selected character not found.');
  }

  const guildId = interaction.guild_id;
  if (!guildId) {
    return await sendError('This command can only be used in a server.');
  }

  const channelName = `game-${character.name.toLowerCase().replace(/\s/g, '-')}`;

  const channelResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      name: channelName,
      type: ChannelType.GuildText,
      permission_overwrites: [
        {
          id: interaction.application_id, // The bot
          type: 1,
          allow: '1024', // View Channel
        },
        {
          id: userId,
          type: 1,
          allow: '1024',
        },
        {
          id: guildId, // @everyone
          type: 0,
          deny: '1024',
        },
      ],
    }),
  });
  const newChannel = await channelResponse.json();
  const channelId = newChannel.id;

  await db.insert(discordGames).values({
    id: nanoid(),
    discordUserId: userId,
    characterId,
    channelId,
    isActive: true,
  });

  // Post character sheet
  const characterImage =
    character.image && typeof character.image === 'string'
      ? await generateImage(character.image)
      : undefined;
  const characterContent = {
    content: formatCharacter(character as AIGeneratedCharacter),
    attachments: [{ id: 0, filename: `${character.name}.png` }],
  };

  const charFormData = new FormData();
  charFormData.append('payload_json', JSON.stringify(characterContent));
  if (characterImage) {
    charFormData.append('files[0]', new Blob([characterImage]), `${character.name}.png`);
  }

  await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    body: charFormData,
  });

  // Post location
  const location = character.location as TravellerWorld;
  const locationImage = await generateImage(generatePlanetImagePrompt(location));
  const locationContent = {
    embeds: [formatLocation(location)],
    attachments: [{ id: 0, filename: `${location.Name}.png` }],
  };
  const locFormData = new FormData();
  locFormData.append('payload_json', JSON.stringify(locationContent));
  if (locationImage) {
    locFormData.append('files[0]', new Blob([locationImage]), `${location.Name}.png`);
  }

  await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    body: locFormData,
  });

  await sendFollowup({
    content: `Your new game is ready! Head over to <#${channelId}> to begin.`,
    flags: MessageFlags.Ephemeral,
  });
};
