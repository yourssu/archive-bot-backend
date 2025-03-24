import { AnySQLiteTable } from 'drizzle-orm/sqlite-core';

import { MapObjectValue, Prettify } from '@/types/misc';

export type InferSchema<T extends AnySQLiteTable> = T['$inferInsert'];

export type ParseBodyFromSchema<T extends AnySQLiteTable> = Prettify<
  MapObjectValue<InferSchema<T>, string>
>;
