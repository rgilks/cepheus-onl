import { REST } from '@discordjs/rest';
import {
  Routes,
  type RESTPostAPIInteractionFollowupJSONBody,
  type APIInteractionResponseUpdateMessage,
} from 'discord-api-types/v10';

const getRestClient = () => {
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token) {
    throw new Error('DISCORD_BOT_TOKEN not set');
  }

  return new REST({ version: '10' }).setToken(token);
};

const createFollowupMessage = (
  applicationId: string,
  interactionToken: string,
  message: RESTPostAPIInteractionFollowupJSONBody
) => {
  const rest = getRestClient();
  return rest.post(Routes.webhook(applicationId, interactionToken), {
    body: message,
  });
};

const editOriginalInteractionResponse = (
  applicationId: string,
  interactionToken: string,
  message: APIInteractionResponseUpdateMessage['data']
) => {
  const rest = getRestClient();
  return rest.patch(Routes.webhookMessage(applicationId, interactionToken, '@original'), {
    body: message,
  });
};

export const discord = {
  createFollowupMessage,
  editOriginalInteractionResponse,
};
