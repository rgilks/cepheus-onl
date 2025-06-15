import { GoogleGenAI } from '@google/genai';

let googleAIClient: GoogleGenAI | undefined;

export const getGoogleAIClient = async (): Promise<GoogleGenAI> => {
  if (!googleAIClient) {
    const apiKey = process.env['GOOGLE_AI_API_KEY'];
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable not set.');
    }
    googleAIClient = new GoogleGenAI({ apiKey });
  }
  return googleAIClient;
};
