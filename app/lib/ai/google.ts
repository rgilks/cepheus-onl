import { GoogleGenAI } from '@google/genai';
import { getGoogleAIClient } from 'app/lib/ai/client';

export { getGoogleAIClient };

export const generateTextCompletion = async (prompt: string): Promise<string> => {
  try {
    console.log('[AI] Generating text completion with prompt:', prompt);
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

export const generateImage = async (prompt: string): Promise<Buffer> => {
  try {
    console.log('[AI] Generating image with prompt:', prompt);
    const genAI: GoogleGenAI = await getGoogleAIClient();
    const model = 'imagen-3.0-generate-002';

    const result = await genAI.models.generateImages({
      model,
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
      },
    });

    const image = result.generatedImages?.[0];

    if (image?.image?.imageBytes) {
      return Buffer.from(image.image.imageBytes);
    }

    throw new Error('No image data received from AI.');
  } catch (error) {
    console.error('[AI] Image generation failed:', error);
    throw error;
  }
};
