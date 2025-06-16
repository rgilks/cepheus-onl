import { getR2Client } from 'app/lib/r2/client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

export const uploadToR2 = async ({
  body,
  contentType,
}: {
  body: Buffer | Uint8Array;
  contentType: string;
}): Promise<string> => {
  if (!process.env.R2_BUCKET_NAME) {
    throw new Error('Missing R2 bucket name');
  }

  const Bucket = process.env.R2_BUCKET_NAME;
  const r2 = getR2Client();
  const key = nanoid();

  try {
    console.log(`[R2] Uploading to ${Bucket}/${key}`);
    const command = new PutObjectCommand({
      Bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await r2.send(command);

    console.log(`[R2] Successfully uploaded to ${Bucket}/${key}`);
    return key;
  } catch (error) {
    console.error('[R2] File upload failed:', error);
    throw error;
  }
};
