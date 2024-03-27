/* eslint-disable radix */
/* eslint-disable consistent-return */
import { DRIZZLE_ORM } from '@app/core/constants/db.constants';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@app/modules/drizzle/schema';
import { and, eq, ne, sql } from 'drizzle-orm';
import { takeUniqueOrNull } from '@app/shared/queries/query';
import { CreateRoomDto } from './room.dto';

@Injectable()
export class RoomService {
  constructor(@Inject(DRIZZLE_ORM) private conn: PostgresJsDatabase<typeof schema>) {}

  async createRoom(userId: string, body: CreateRoomDto) {
    const [room] = await this.conn
      .insert(schema.rooms)
      .values({
        host_id: userId,
        code: this.generateID(6),
        roomStatus: 'queue',
        ...body,
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
    const statement = sql`SELECT COUNT(*)
    FROM ${schema.usersToRooms} WHERE ${schema.usersToRooms.roomId} = ${room.id};
    `;
    const constRes = await this.conn.execute(statement);
    if (checkUserToRoom) {
      await this.conn
        .update(schema.usersToRooms)
        .set({ isInRoom: true })
        .where(and(eq(schema.usersToRooms.roomId, room.id), eq(schema.usersToRooms.userId, userId)));
      return;
    }
    const [rel] = await this.conn
      .insert(schema.usersToRooms)
      .values({
        userId,
        roomId: room.id,
        no: (parseInt(constRes[0]?.count.toString()) || 0) + 1,
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

  async getRoomUserList(roomCode: string) {
    const users = await this.conn.query.rooms.findFirst({
      where: eq(schema.rooms.code, roomCode),
      with: {
        usersToRooms: {
          where: eq(schema.usersToRooms.isInRoom, true),
          with: { user: true },
        },
      },
    });
    const res: any = {
      users: users.usersToRooms.map((u) => {
        return {
          id: u.user.id,
          name: u.user.name,
          point: u.point,
        };
      }),
    };
    delete users.usersToRooms;
    res.roomData = users;
    return res;
  }

  async checkUserRoomExist(userId: string) {
    const statement = sql`SELECT ${schema.rooms}.*
    FROM  ${schema.rooms}
    JOIN  ${schema.usersToRooms} ON ${schema.rooms.id} = ${schema.usersToRooms.roomId}
    WHERE ${schema.usersToRooms.userId} = ${userId} AND ${schema.usersToRooms.isInRoom} = TRUE AND ${schema.rooms.roomStatus} != 'finish' ORDER BY create_at DESC;
    `;

    const res = await this.conn.execute(statement);
    return res[0];
  }

  async userLeaveRoom(userId: string, roomId: string) {
    const update = await this.conn
      .update(schema.usersToRooms)
      .set({ isInRoom: false })
      .where(and(eq(schema.usersToRooms.roomId, roomId), eq(schema.usersToRooms.userId, userId)));
    return update;
  }

  async checkRoom(code: string) {
    return this.conn.query.rooms.findFirst({ where: and(eq(schema.rooms.code, code), ne(schema.rooms.roomStatus, 'finish')) });
  }
}
