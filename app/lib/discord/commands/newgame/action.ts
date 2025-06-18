import {
  type APIChatInputApplicationCommandInteraction,
  type APIMessageComponentInteraction,
  MessageFlags,
  ComponentType,
  ButtonStyle,
  ChannelType,
  InteractionType,
} from 'discord-api-types/v10';
import { getDb } from '@/lib/db';
import { discordGames, generatedCharacters } from '@/lib/db/schema';
import { and, eq, notInArray } from 'drizzle-orm';
import {
  formatCharacter,
  generateAndSaveCharacter,
  formatLocation,
  generatePlanetImagePrompt,
} from '@/app/lib/actions/chargen';
import { Races, type CharacterInPlay } from '@/app/lib/domain/types/character';
import { generateImage } from '@/app/lib/ai/google';
import { TravellerWorld } from '@/app/lib/domain/types/travellermap';
import { nanoid } from 'nanoid';

const sendFollowup = async (
  interaction: APIChatInputApplicationCommandInteraction | APIMessageComponentInteraction,
  payload: object
) => {
  const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;
  await fetch(followupUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};

const updateOriginalMessage = async (
  interaction: APIMessageComponentInteraction,
  payload: object
) => {
  const url = `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 7, // Update message
      data: payload,
    }),
  });
};

const sendError = async (
  interaction: APIChatInputApplicationCommandInteraction | APIMessageComponentInteraction,
  message: string
) => {
  try {
    const followupUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;
    await fetch(followupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: message,
        flags: MessageFlags.Ephemeral,
      }),
    });
  } catch (e) {
    console.error('Failed to send error message', e);
  }
};

const presentCharacter = async (
  interaction: APIChatInputApplicationCommandInteraction | APIMessageComponentInteraction,
  character: CharacterInPlay,
  rerollCount: number
) => {
  const rerollsLeft = 2 - rerollCount;
  const components = [
    {
      type: ComponentType.Button,
      style: ButtonStyle.Success,
      label: 'Accept',
      custom_id: `newgame_accept_${character.id}`,
    },
  ];

  if (rerollsLeft > 0) {
    components.push({
      type: ComponentType.Button,
      style: ButtonStyle.Primary,
      label: `Reroll (${rerollsLeft} left)`,
      custom_id: `newgame_reroll_${character.id}_${rerollCount + 1}`,
    });
  }

  const payload = {
    content: `Your new character is ready. You can reroll ${rerollsLeft} more time(s).`,
    embeds: [
      {
        title: character.name,
        description: formatCharacter({
          name: character.name,
          backstory: character.story,
          // The following fields are not strictly necessary for display but are part of the type.
          upp: (character.stats as { upp: string }).upp,
          age: (character.stats as { age: number }).age,
          careers: [],
          credits: 0,
          skills: [],
        }),
      },
    ],
    components: [{ type: ComponentType.ActionRow, components }],
    flags: MessageFlags.Ephemeral,
  };

  if (interaction.type === InteractionType.ApplicationCommand) {
    await sendFollowup(interaction, payload);
  } else {
    await updateOriginalMessage(interaction as APIMessageComponentInteraction, payload);
  }
};

export const action = async (interaction: APIChatInputApplicationCommandInteraction) => {
  const userId = interaction.member?.user.id;
  if (!userId) {
    return await sendError(interaction, 'Could not identify you.');
  }

  const db = await getDb();
  const existingGame = await db
    .select()
    .from(discordGames)
    .where(eq(discordGames.discordUserId, userId))
    .get();

  if (existingGame && existingGame.isActive) {
    return await sendError(
      interaction,
      'You already have an active game. Please end your current game before starting a new one.'
    );
  }

  await fetch(
    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 5, // Defer
        data: {
          flags: MessageFlags.Ephemeral,
        },
      }),
    }
  );

  try {
    const character = (await generateAndSaveCharacter(
      Object.values(Races)[Math.floor(Math.random() * Object.values(Races).length)],
      userId
    )) as CharacterInPlay;

    if (!character) {
      return await sendError(interaction, 'Failed to generate a character.');
    }
    await presentCharacter(interaction, character, 0);
  } catch (e) {
    console.error('Error in newgame action', e);
    await sendError(interaction, 'Failed to generate character, please try again.');
  }
};

export const handleComponentInteraction = async (interaction: APIMessageComponentInteraction) => {
  const userId = interaction.member?.user.id;
  if (!userId) {
    return await sendError(interaction, 'Could not identify you.');
  }

  const customId = interaction.data.custom_id;
  const db = await getDb();

  if (customId.startsWith('newgame_reroll_')) {
    await fetch(
      `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 6, // Defer update message
        }),
      }
    );
    const [, , oldCharacterId, rerollCountStr] = customId.split('_');
    const rerollCount = parseInt(rerollCountStr, 10);

    // Delete the old character
    await db.delete(generatedCharacters).where(eq(generatedCharacters.id, oldCharacterId));

    const newCharacter = (await generateAndSaveCharacter(
      Object.values(Races)[Math.floor(Math.random() * Object.values(Races).length)],
      userId
    )) as CharacterInPlay;
    if (!newCharacter) {
      return await sendError(interaction, 'Failed to generate a character.');
    }
    await presentCharacter(interaction, newCharacter, rerollCount);
    return;
  }

  if (customId.startsWith('newgame_accept_')) {
    const characterId = customId.replace('newgame_accept_', '');
    const character = (await db
      .select()
      .from(generatedCharacters)
      .where(eq(generatedCharacters.id, characterId))
      .get()) as CharacterInPlay;

    if (!character) {
      return await sendError(interaction, 'Selected character not found.');
    }

    // Clean up other characters that might have been generated for this user
    await db
      .delete(generatedCharacters)
      .where(
        and(
          eq(generatedCharacters.owner, userId),
          notInArray(generatedCharacters.id, [characterId])
        )
      );

    const guildId = interaction.guild_id;
    if (!guildId) {
      return await sendError(interaction, 'This command can only be used in a server.');
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
            id: interaction.application_id,
            type: 1,
            allow: '1024',
          },
          {
            id: userId,
            type: 1,
            allow: '1024',
          },
          {
            id: guildId,
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

    const channelMessageRequest = async (payload: object, image?: Blob) => {
      const formData = new FormData();
      formData.append('payload_json', JSON.stringify(payload));
      if (image) {
        const attachment = (payload as { attachments: { filename: string }[] }).attachments[0];
        formData.append(`files[0]`, image, attachment.filename);
      }
      await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
        body: formData,
      });
    };

    const characterImage =
      character.image && typeof character.image === 'string'
        ? await generateImage(character.image)
        : undefined;
    const characterContent = {
      content: formatCharacter({
        name: character.name,
        backstory: character.story,
        // The following fields are not strictly necessary for display but are part of the type.
        upp: (character.stats as { upp: string }).upp,
        age: (character.stats as { age: number }).age,
        careers: [],
        credits: 0,
        skills: [],
      }),
      attachments: [{ id: 0, filename: `${character.name}.png` }],
    };
    await channelMessageRequest(
      characterContent,
      characterImage ? new Blob([characterImage]) : undefined
    );

    const location = character.location as TravellerWorld;
    const locationImage = await generateImage(generatePlanetImagePrompt(location));
    const locationContent = {
      embeds: [formatLocation(location)],
      attachments: [{ id: 0, filename: `${location.Name}.png` }],
    };
    await channelMessageRequest(
      locationContent,
      locationImage ? new Blob([locationImage]) : undefined
    );

    await updateOriginalMessage(interaction, {
      content: `Your new game is ready! Head over to <#${channelId}> to begin.`,
      components: [],
      embeds: [],
    });
  }
};
