/* eslint-disable consistent-return */
import { DRIZZLE_ORM } from '@app/core/constants/db.constants';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@app/modules/drizzle/schema';
import { and, eq, count } from 'drizzle-orm';
import { takeUniqueOrNull } from '@app/shared/queries/query';

@Injectable()
export class RoomService {
  constructor(@Inject(DRIZZLE_ORM) private conn: PostgresJsDatabase<typeof schema>) {}

  async createRoom(userId: string) {
    const [room] = await this.conn
      .insert(schema.rooms)
      .values({
        host_id: userId,
        code: this.generateID(6),
        roomStatus: 'queue',
      })
      .returning();
    return room;
  }

  async getRoomUser(userId: string) {
    return this.conn.select().from(schema.users).where(eq(schema.users.id, userId)).then(takeUniqueOrNull);
  }

  async joinRoom(roomCode: string, userId: string) {
    const room = await this.conn.query.rooms.findFirst({ where: eq(schema.rooms.code, roomCode) });

    const checkUserToRoom = await this.conn.query.usersToRooms.findFirst({
      where: and(eq(schema.usersToRooms.userId, userId), eq(schema.usersToRooms.roomId, room.id)),
    });
    const roomUserCount = await this.conn
      .select({ value: count() })
      .from(schema.usersToRooms)
      .where(and(eq(schema.usersToRooms.userId, userId), eq(schema.usersToRooms.roomId, room.id)))[0];
    if (checkUserToRoom) {
      return;
    }
    const [rel] = await this.conn
      .insert(schema.usersToRooms)
      .values({
        userId,
        roomId: room.id,
        no: roomUserCount + 1,
      })
      .returning();
    return rel;
  }

  generateID(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
