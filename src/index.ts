import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { stream } from 'hono/streaming';

import { d1 } from '@/db';
import { channels, messages, threads } from '@/db/schema';
import { uploadFileMiddleware } from '@/middlewares/upload';
import { ParseBodyFromSchema } from '@/types/schema';
import { WorkersEnv } from '@/types/workers';
import { handleError } from '@/utils/error';
import { getVariousFileType } from '@/utils/file';
import { getMimetype } from '@/utils/mime';
import { getObject, getObjectFileSize } from '@/utils/s3';
import { transformStringBoolean } from '@/utils/transform';

type HonoBindings = {
  Bindings: WorkersEnv; // eslint-disable-line @typescript-eslint/naming-convention
};

const app = new Hono<HonoBindings>();

app.get('/channels', async (c) => {
  const db = d1(c.env.DB);
  const result = await db.select().from(channels).all();
  return c.json(result);
});

app.get('/channel/:id', async (c) => {
  const { id } = c.req.param();
  const db = d1(c.env.DB);
  const result = await db.select().from(channels).where(eq(channels.id, id));

  if (result.length === 0) {
    return c.json(handleError(new Error('올바르지 않은 채널 id에요.')), 400);
  }

  return c.json(result[0]);
});

app.post('/channel/add', async (c) => {
  const body = await c.req.parseBody<ParseBodyFromSchema<typeof channels>>();

  const db = d1(c.env.DB);

  try {
    await db.insert(channels).values(body).onConflictDoNothing().run();
  } catch (e: unknown) {
    return c.json(handleError(e), 400);
  }

  return c.text('OK');
});

app.get('/:channelId/threads', async (c) => {
  const { channelId } = c.req.param();
  const db = d1(c.env.DB);
  const result = await db.query.threads.findMany({
    where: eq(threads.channel, channelId),
    with: {
      head: true,
      channel: true,
    },
  });
  return c.json(result);
});

app.get('/thread/:id', async (c) => {
  const { id } = c.req.param();
  const db = d1(c.env.DB);

  const result = await db.query.threads.findFirst({
    where: eq(threads.ts, id),
    with: {
      head: true,
      channel: true,
    },
  });

  if (!result) {
    return c.json(handleError(new Error('올바르지 않은 스레드 id에요.')), 400);
  }

  return c.json(result);
});

app.post('/thread/add', async (c) => {
  const body = await c.req.parseBody<ParseBodyFromSchema<typeof threads>>();

  const db = d1(c.env.DB);

  try {
    await db
      .insert(threads)
      .values(body)
      .onConflictDoUpdate({
        target: threads.ts,
        set: body,
      })
      .run();
  } catch (e: unknown) {
    return c.json(handleError(e), 400);
  }

  return c.text('OK');
});

app.get('/:threadId/messages', async (c) => {
  const { threadId } = c.req.param();
  const db = d1(c.env.DB);
  const result = await db.query.messages.findMany({
    where: eq(messages.threadTs, threadId),
    with: {
      thread: true,
      channel: true,
    },
  });
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
    await db
      .insert(messages)
      .values(value)
      .onConflictDoUpdate({
        target: messages.ts,
        set: value,
      })
      .run();
  } catch (e: unknown) {
    return c.json(handleError(e), 400);
  }

  return c.text('OK');
});

app.get('/file/:id', async (c) => {
  const { id } = c.req.param();
  const mimeType = getMimetype(id);

  if (!mimeType) {
    return c.json(handleError(new Error('id가 잘못되었어요.')), 400);
  }

  const fileType = getVariousFileType(mimeType);
  if (fileType === 'unknown') {
    return c.json(handleError(new Error('지원하지 않는 파일 형식이에요.')), 400);
  }

  c.header('Content-Encoding', 'Identity');

  if (fileType === 'image') {
    const file = await getObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: id,
    });
    const arr = await file.Body!.transformToByteArray();
    return c.body(arr, {
      status: 200,
      headers: {
        'Content-Type': file.ContentType ?? '',
      },
    });
  }

  const videoSize = await getObjectFileSize({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: id,
  });

  const range = c.req.header('Range');
  c.status(206);

  if (!range) {
    const file = await getObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: id,
    });
    const webStream = file.Body!.transformToWebStream();

    c.header('Content-Type', file.ContentType ?? '');
    c.header('Content-Length', videoSize.toString());

    return stream(c, async (stream) => {
      stream.pipe(webStream);
    });
  }

  const parts = range.replace(/bytes=/, ``).split(`-`);
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
  const chunkSize = end - start + 1;

  const file = await getObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: id,
    Range: `bytes=${start}-${end}`,
  });

  c.header('Content-Type', file.ContentType ?? '');
  c.header('Content-Length', chunkSize.toString());
  c.header('Content-Range', `bytes ${start}-${end}/${videoSize}`);

  const webStream = file.Body!.transformToWebStream();
  return stream(c, async (stream) => {
    stream.pipe(webStream);
  });
});

app.put('/file/upload', uploadFileMiddleware, async (c) => {
  return c.json({ success: true, key: c.get('key') });
});

app.onError((err, c) => {
  return c.json(handleError(err), 500);
});

export default app;
