import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type MessageUser = {
  avatar: string;
  id: string;
  isBot: boolean;
  name: string;
};

export type MessageReactionItem = {
  count: number;
  name: string;
  users: string[];
};

export type MessageFileItem = {
  created: number;
  filetype: string;
  height?: string;
  id: string;
  mimetype: string;
  name: string;
  size: number;
  width?: string;
};

export const messages = sqliteTable('messages', {
  ts: text('ts').primaryKey().notNull(),
  threadTs: text('threadTs').notNull(),
  channel: text('channel').notNull(),
  edited: integer('edited', { mode: 'boolean' }).notNull(),
  user: text('user', { mode: 'json' }).$type<MessageUser>().notNull(),
  reactions: text('reactions', { mode: 'json' }).$type<MessageReactionItem[]>(),
  files: text('files', { mode: 'json' }).$type<MessageFileItem[]>(),
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
});

export const threadsRelations = relations(threads, ({ many, one }) => ({
  messages: many(messages),
  head: one(messages, {
    fields: [threads.ts],
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
