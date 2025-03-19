import { drizzle } from 'drizzle-orm/d1';

export const d1 = (db: D1Database) => drizzle(db);

// export const s3 = new Bun.S3Client({
//   accessKeyId: Bun.env.S3_IAM_ACCESS_KEY_ID,
//   secretAccessKey: Bun.env.S3_IAM_SECRET_ACCESS_KEY,
//   region: Bun.env.S3_BUCKET_REGION,
//   bucket: Bun.env.S3_BUCKET_NAME,
// });
