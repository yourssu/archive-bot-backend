import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createMiddleware } from 'hono/factory';

import { s3 } from '@/db';
import { MiddlewareVariables } from '@/types/middleware';
import { handleError } from '@/utils/error';
import { getExtension } from '@/utils/mime';
import { checkObjectExists } from '@/utils/s3';

export const uploadFileMiddleware = createMiddleware<MiddlewareVariables<{ key: string }>>(
  async (c, next) => {
    const { file, id } = await c.req.parseBody();

    if (!file || !(file instanceof File)) {
      return c.json(handleError(new Error('file 필드가 없거나 올바르지 않아요.')), 400);
    }

    if (!id || typeof id !== 'string') {
      return c.json(handleError(new Error('id 필드가 없거나 올바르지 않아요.')), 400);
    }

    const extension = getExtension(file.type);
    if (!extension) {
      return c.json(handleError(new Error('지원하지 않는 확장자에요.')), 400);
    }

    const key = `${id}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const exists = await checkObjectExists({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });

      if (!exists) {
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
          })
        );
      }
    } catch (e: unknown) {
      return c.json(handleError(e), 500);
    }

    c.set('key', key);
    await next();
  }
);
