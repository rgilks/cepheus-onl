import { type RESTPostAPIInteractionFollowupJSONBody } from 'discord-api-types/v10';

const createFollowupMessage = async (
  applicationId: string,
  interactionToken: string,
  message: RESTPostAPIInteractionFollowupJSONBody
) => {
  const url = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`;
  console.log(`Fetching ${url}`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    console.error(`Failed to send followup message: ${res.status} ${res.statusText}`);
    const body = await res.text();
    console.error(`Response body: ${body}`);
  }
  const json = await res.json();
  return json;
};

export const discord = {
  createFollowupMessage,
};
