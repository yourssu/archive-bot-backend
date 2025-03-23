import { S3Client } from '@aws-sdk/client-s3';
import { drizzle } from 'drizzle-orm/d1';

import * as schema from '@/db/schema';

export const d1 = (db: D1Database) =>
  drizzle(db, {
    schema,
  });

export const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_IAM_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_IAM_SECRET_ACCESS_KEY,
  },
});
