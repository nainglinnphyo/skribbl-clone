import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IResponse } from '@app/core/interfaces/response.interface';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@app/modules/drizzle/schema';
import { DRIZZLE_ORM } from '@app/core/constants/db.constants';
import { and, eq } from 'drizzle-orm';
import { takeUniqueOrNull } from '@app/shared/queries/query';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(DRIZZLE_ORM) private conn: PostgresJsDatabase<typeof schema>,
  ) {}

  async validateUser(userId: string): Promise<IResponse> {
    const user = await this.conn.select().from(schema.users).where(eq(schema.users.id, userId)).then(takeUniqueOrNull);
    return {
      _metadata: {
        message: '',
        statusCode: 200,
      },
      _data: { user },
    };
  }

  async createUser(deviceId: string, name?: string) {
    const resUser = await this.conn.select().from(schema.users).where(eq(schema.users.email, deviceId)).then(takeUniqueOrNull);
    const [user] = await this.conn
      .insert(schema.users)
      .values({ email: deviceId, name: name === null ? resUser.name : name, password: deviceId })
      .onConflictDoUpdate({
        target: schema.users.email,
        set: { email: deviceId, name: name === null ? resUser.name : name, password: deviceId },
      })
      .returning({ insertedId: schema.users.id, email: schema.users.email, name: schema.users.name });
    return user;
  }

  async checkUserExist(email: string) {
    return this.conn.select().from(schema.users).where(eq(schema.users.email, email)).then(takeUniqueOrNull);
  }

  async register(dto: { name: string; email: string; password: string }) {
    const [user] = await this.conn
      .insert(schema.users)
      .values({ ...dto })
      .returning({ insertedId: schema.users.id, email: schema.users.email });
    return user;
  }

  async verifyPassword(dto: { email: string; password: string }) {
    return this.conn.query.users.findFirst({
      where: and(eq(schema.users.email, dto.email), eq(schema.users.password, dto.password)),
    });
  }

  generateToken(payload: { userId: string; email: string }) {
    return this.jwtService.signAsync(payload, {
      secret: 'secret',
    });
  }
}
