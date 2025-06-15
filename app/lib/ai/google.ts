import { GoogleGenAI } from '@google/genai';
import { getGoogleAIClient } from 'app/lib/ai/client';

export { getGoogleAIClient };

export class AIError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'AIError';
  }
}

const handleAIError = (error: unknown, context: string): never => {
  let errorMessage = 'Unknown AI error';
  let originalErrorForRethrow = error;

  if (error instanceof Error) {
    errorMessage = error.message;
    if (error instanceof AIError) {
      originalErrorForRethrow = error.originalError ?? error;
    }
  } else {
    console.error(`[AI] ${context} failed with non-Error object:`, error);
  }

  if (typeof errorMessage === 'string' && errorMessage.includes('SAFETY')) {
    console.warn(`[AI] Safety setting blocked response in ${context}: ${errorMessage}`);
    throw new AIError(`Safety setting blocked response: ${errorMessage}`, originalErrorForRethrow);
  }

  console.error(`[AI] ${context} failed. Message: ${errorMessage}`, originalErrorForRethrow);
  throw new AIError(`${context} failed: ${errorMessage}`, originalErrorForRethrow);
};

interface GenAIResponse {
  text?: string;
}

const extractTextFromResponse = (response: GenAIResponse): string => {
  const { text } = response;
  if (!text) {
    console.error('[AI] Failed to extract text from response:', JSON.stringify(response, null, 2));
    throw new AIError('No content received from AI or failed to extract text.');
  }
  return text;
};

export const getActiveVisionModel = async (): Promise<{ name: string }> => {
  const modelName = process.env['GOOGLE_AI_VISION_MODEL'] ?? 'gemini-1.5-pro-latest';
  if (!process.env['GOOGLE_AI_VISION_MODEL']) {
    console.warn(
      `[AI] GOOGLE_AI_VISION_MODEL environment variable not set. Using default: ${modelName}`
    );
  }
  return { name: modelName };
};

export const generateTextCompletion = async (prompt: string): Promise<string> => {
  try {
    const genAI: GoogleGenAI = await getGoogleAIClient();
    const modelName = process.env['GOOGLE_AI_GENERATION_MODEL'] ?? 'gemini-1.5-flash-latest';

    if (!process.env['GOOGLE_AI_GENERATION_MODEL']) {
      console.warn(
        `[AI] GOOGLE_AI_GENERATION_MODEL environment variable not set. Using default: ${modelName}`
      );
    }

    const result = await genAI.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 2048,
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      },
    });

    return extractTextFromResponse(result);
  } catch (error) {
    return handleAIError(error, 'Text completion generation');
  }
};
