import { GoogleGenAI } from '@google/genai';
import { getGoogleAIClient } from 'app/lib/ai/client';

export { getGoogleAIClient };

export const generateTextCompletion = async (prompt: string): Promise<string> => {
  try {
    const genAI: GoogleGenAI = await getGoogleAIClient();
    const modelName = 'gemini-2.5-flash-preview-05-20';

    const { text } = await genAI.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 4096,
        temperature: 1.2,
        topP: 0.95,
        topK: 40,
      },
    });

    if (!text) {
      throw new Error('No content received from AI or failed to extract text.');
    }

    return text;
  } catch (error) {
    console.error('[AI] Text completion generation failed:', error);
    throw error;
  }
};
