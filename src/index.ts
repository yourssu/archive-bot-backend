import { Hono } from 'hono';

import { WorkersEnv } from '@/types/workers';

type HonoBindings = {
  Bindings: WorkersEnv; // eslint-disable-line @typescript-eslint/naming-convention
};

const app = new Hono<HonoBindings>();

export default app;
