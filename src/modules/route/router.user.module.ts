import { Module } from '@nestjs/common';
import { UserController } from '../user/user.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [],
  imports: [UserModule],
})
export class RoutesUserModule {}
