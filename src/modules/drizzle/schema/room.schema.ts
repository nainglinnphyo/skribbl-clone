import { pgTable, varchar, uuid } from 'drizzle-orm/pg-core';
// import { relations } from 'drizzle-orm';

export const rooms = pgTable('rooms', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  code: varchar('code', { length: 256 }).unique(),
});
