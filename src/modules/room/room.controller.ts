import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { RoomService } from './room.service';

@Controller({
  version: '1',
  path: '',
})
@ApiTags('Room')
export class RoomController {
  // constructor(private roomService: RoomService) {}

  @Post('create')
  async createRoom() {
    return '';
  }
}
