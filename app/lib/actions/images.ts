'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { generateImage } from 'app/lib/ai/google';

export const generateAndUploadImage = async (prompt: string): Promise<string> => {
  try {
    const imageBytes = await generateImage(prompt);
    const fileKey = `generated-images/${Date.now()}.png`;

    const { env } = getCloudflareContext();

    await env.R2_IMAGES_BUCKET.put(fileKey, imageBytes, {
      httpMetadata: {
        contentType: 'image/png',
      },
    });

    console.log(`Image uploaded to R2 as ${fileKey}`);
    return fileKey;
  } catch (error) {
    console.error('Failed to generate and upload image:', error);
    throw new Error('Failed to generate and upload image.');
  }
};
