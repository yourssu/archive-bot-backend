import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const messages = sqliteTable('messages', {
  ts: text('ts').primaryKey().notNull(),
  threadTs: text('threadTs').notNull(),
  channel: text('channel').notNull(),
  edited: integer('edited', { mode: 'boolean' }).notNull(),
  user: text('user', { mode: 'json' }).notNull(),
  reactions: text('reactions', { mode: 'json' }),
  files: text('files', { mode: 'json' }),
  text: text('text'),
});
