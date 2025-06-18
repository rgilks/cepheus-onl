'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { nanoid } from 'nanoid';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export const saveImage = async (image: Uint8Array): Promise<string> => {
  const filename = `${nanoid()}.png`;

  if (process.env.NODE_ENV === 'development') {
    const localPath = path.join(process.cwd(), '.wrangler', 'images');
    await mkdir(localPath, { recursive: true });
    const filePath = path.join(localPath, filename);
    await writeFile(filePath, image);
    console.log(`Image saved locally to ${filePath}`);
    return filePath;
  }

  try {
    const { env } = getCloudflareContext();
    const result = await env.R2_IMAGES_BUCKET.put(filename, image, {
      httpMetadata: {
        contentType: 'image/png',
      },
    });
    console.log(`Image uploaded to R2 as ${result.key}`);
    return result.key;
  } catch (error) {
    console.error('Failed to upload image to R2:', error);
    throw new Error('Failed to upload image.');
  }
};
