import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { FetchHttpHandler } from '@aws-sdk/fetch-http-handler';
import { v4 as uuidv4 } from 'uuid';

const getS3Client = (): S3Client => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error('Missing R2 environment variables');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    requestHandler: new FetchHttpHandler(),
  });
};

export const uploadImage = async (image: Uint8Array): Promise<string> => {
  const client = getS3Client();
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicDomain = process.env.R2_PUBLIC_DOMAIN;
  const key = `${uuidv4()}.png`;

  if (!bucketName || !publicDomain) {
    throw new Error('R2_BUCKET_NAME or R2_PUBLIC_DOMAIN is not set');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: image,
    ContentType: 'image/png',
  });

  try {
    await client.send(command);
    const url = `${publicDomain}/${key}`;
    console.log(`[R2] Successfully uploaded image to ${url}`);
    return url;
  } catch (error) {
    console.error('[R2] Error uploading image:', error);
    throw error;
  }
};
