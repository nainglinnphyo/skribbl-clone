import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { roomEnum } from './enum';
import { users } from './user';

export const rooms = pgTable('rooms', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  code: varchar('code', { length: 256 }).unique(),
  round: integer('round').default(3),
  playerCount: integer('player_count').default(8),
  drawTimeInSec: integer('draw_time_in_sec').default(80),
  wordCount: integer('word_count').default(3),
  hit: integer('hit').default(2),
  startAt: timestamp('start_at'),
  roomStatus: roomEnum('room_status'),
  host_id: uuid('host_id')
    .notNull()
    .references(() => users.id),
});
