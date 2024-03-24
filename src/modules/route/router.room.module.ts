import { Module } from '@nestjs/common';
import { RoomController } from '../room/room.controller';
import { RoomService } from '../room/room.service';
import { RoomModule } from '../room/room.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
  imports: [RoomModule],
})
export class RoutesRoomModule {}
