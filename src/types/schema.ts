import { AnySQLiteTable } from 'drizzle-orm/sqlite-core';

import { MapObjectValue, Prettify } from '@/types/misc';

export type ParseBodyFromSchema<T extends AnySQLiteTable> = Prettify<
  MapObjectValue<T['$inferInsert'], string>
>;
