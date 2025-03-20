import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Hono } from 'hono';

import { d1, s3 } from '@/db';
import { messages } from '@/db/schema';
import { uploadFileMiddleware } from '@/middlewares/upload';
import { ParseBodyFromSchema } from '@/types/schema';
import { WorkersEnv } from '@/types/workers';
import { handleError } from '@/utils/error';
import { transformStringBoolean } from '@/utils/transform';

type HonoBindings = {
  Bindings: WorkersEnv; // eslint-disable-line @typescript-eslint/naming-convention
};

const app = new Hono<HonoBindings>();

app.get('/messages', async (c) => {
  const db = d1(c.env.DB);
  const result = await db.select().from(messages).all();
  return c.json(result);
});

app.post('/message/add', async (c) => {
  const body = await c.req.parseBody<ParseBodyFromSchema<typeof messages>>();
  const value = {
    ...body,
    edited: transformStringBoolean(body.edited),
  };

  const db = d1(c.env.DB);

  try {
    await db.insert(messages).values(value).run();
  } catch (e: unknown) {
    return c.json(handleError(e), 400);
  }

  return c.text('OK');
});

app.get('/image/:id', async (c) => {
  const { id } = c.req.param();

  const file = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${id}.png`,
    })
  );

  const arr = await file.Body!.transformToByteArray();

  return c.body(arr, {
    status: 201,
    headers: {
      'Content-Type': 'image/png',
    },
  });
});

app.post('/image/upload', uploadFileMiddleware, async (c) => {
  return c.json({ success: true, id: c.get('id') });
});

export default app;
