/* eslint-disable @typescript-eslint/no-use-before-define */
import { relations } from 'drizzle-orm';
import { integer, pgTable, uuid, boolean } from 'drizzle-orm/pg-core';
import { users } from './user';
import { rooms } from './room';

export const roomRelations = relations(rooms, ({ one, many }) => ({
  host: one(users, { fields: [rooms.host_id], references: [users.id] }),
  usersToRooms: many(usersToRooms),
}));

export const userRelations = relations(users, ({ many }) => ({
  rooms: many(rooms),
  usersToRooms: many(usersToRooms),
}));

export const usersToRooms = pgTable(
  'users_to_rooms',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    roomId: uuid('room_id')
      .notNull()
      .references(() => rooms.id),
    no: integer('no').default(0),
    point: integer('point').default(0),
    isInRoom: boolean('isInRoom').default(true),
    currentRound: integer('currentRound').default(1),
  },
  // (table) => ({
  //   cpk: primaryKey({ name: 'composite_key', columns: [table.roomId, table.userId] }),
  // }),
);

export const usersToRoomsRelations = relations(usersToRooms, ({ one }) => ({
  room: one(rooms, {
    fields: [usersToRooms.roomId],
    references: [rooms.id],
  }),
  user: one(users, {
    fields: [usersToRooms.userId],
    references: [users.id],
  }),
}));
