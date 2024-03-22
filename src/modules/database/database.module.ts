// database-config.service.ts

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
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true, // set to false in production
    });
  }
}

// this.configService.get<string>('DB_HOST', 'localhost'),
