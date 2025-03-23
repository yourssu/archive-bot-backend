import { relations } from 'drizzle-orm';
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

export const messagesRelations = relations(messages, ({ one }) => ({
  thread: one(threads, {
    fields: [messages.threadTs],
    references: [threads.ts],
  }),
  channel: one(channels, {
    fields: [messages.channel],
    references: [channels.id],
  }),
}));

export const threads = sqliteTable('threads', {
  ts: text('ts').primaryKey().notNull(),
  archivedAt: text('archivedAt').notNull(),
  channel: text('channel').notNull(),
  headId: text('headId').notNull(),
});

export const threadsRelations = relations(threads, ({ many, one }) => ({
  messages: many(messages),
  head: one(messages, {
    fields: [threads.headId],
    references: [messages.ts],
  }),
  channel: one(channels, {
    fields: [threads.channel],
    references: [channels.id],
  }),
}));

export const channels = sqliteTable('channels', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
});

export const channelsRelations = relations(channels, ({ many }) => ({
  threads: many(threads),
  messages: many(messages),
}));
