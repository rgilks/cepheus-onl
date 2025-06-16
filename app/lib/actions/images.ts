'use server';

import { generateImage } from 'app/lib/ai/google';
import { R2Client } from 'app/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const generateAndUploadImage = async (prompt: string): Promise<string> => {
  try {
    const imageBytes = await generateImage(prompt);
    const fileKey = `generated-images/${Date.now()}.png`;

    await R2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
        Body: imageBytes,
        ContentType: 'image/png',
      })
    );

    console.log(`Image uploaded to R2 as ${fileKey}`);
    return fileKey;
  } catch (error) {
    console.error('Failed to generate and upload image:', error);
    throw new Error('Failed to generate and upload image.');
  }
};
