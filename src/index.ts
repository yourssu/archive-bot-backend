import { Hono } from 'hono';

import { d1 } from '@/db';
import { messages } from '@/db/schema';
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

export default app;
