import { Module } from '@nestjs/common';
import { RoomController } from '../room/room.controller';
import { RoomService } from '../room/room.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  exports: [],
  imports: [],
})
export class RoutesRoomModule {}
