import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createMiddleware } from 'hono/factory';
import { getExtension } from 'hono/utils/mime';
import { v4 as uuidv4 } from 'uuid';

import { s3 } from '@/db';
import { MiddlewareVariables } from '@/types/middleware';
import { handleError } from '@/utils/error';

export const uploadFileMiddleware = createMiddleware<MiddlewareVariables<{ id: string }>>(
  async (c, next) => {
    const { image } = await c.req.parseBody();

    if (image === undefined) {
      return c.json(handleError(new Error('image 필드가 비어있어요.')), 400);
    }

    if (!(image instanceof File)) {
      return c.json(handleError(new Error('image 필드가 파일이 아니에요.')), 400);
    }

    const extension = getExtension(image.type);
    if (!extension) {
      return c.json(handleError(new Error('지원하지 않는 확장자에요.')), 400);
    }

    const id = uuidv4();
    const fileName = `${id}.${extension}`;
    const buffer = Buffer.from(await image.arrayBuffer());

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
        })
      );
    } catch (e: unknown) {
      return c.json(handleError(e), 500);
    }

    c.set('id', id);
    await next();
  }
);
