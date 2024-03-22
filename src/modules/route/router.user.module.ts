import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/core/common/entities/user.entity';
import { UserController } from '../user/user.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [],
  imports: [UserModule, TypeOrmModule.forFeature([User])],
})
export class RoutesUserModule {}
