// database-config.service.ts

import { Room } from '@app/core/common/entities/room.entity';
import { User } from '@app/core/common/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class TypeOrmModule {
  static forRoot() {
    const configService = new ConfigService();
    return NestTypeOrmModule.forRoot({
      type: 'mongodb',
      url: configService.get<string>('DATABASE_URL', 'localhost'),
      database: configService.get<string>('DB_NAME', 'localhost'),
      // entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      entities: [User],
      synchronize: true, // set to false in production
    });
  }
}

// this.configService.get<string>('DB_HOST', 'localhost'),
