import { pgEnum } from 'drizzle-orm/pg-core';

export const roomEnum = pgEnum('room_enum', ['queue', 'ongoing', 'finish']);
