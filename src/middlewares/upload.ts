import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createMiddleware } from 'hono/factory';
import { v4 as uuidv4 } from 'uuid';

import { s3 } from '@/db';
import { MiddlewareVariables } from '@/types/middleware';
import { handleError } from '@/utils/error';
import { getExtension } from '@/utils/mime';

export const uploadFileMiddleware = createMiddleware<MiddlewareVariables<{ key: string }>>(
  async (c, next) => {
    const file = await c.req.blob();

    const extension = getExtension(file.type);
    if (!extension) {
      return c.json(handleError(new Error('지원하지 않는 확장자에요.')), 400);
    }

    const key = `${uuidv4()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );
    } catch (e: unknown) {
      return c.json(handleError(e), 500);
    }

    c.set('key', key);
    await next();
  }
);
