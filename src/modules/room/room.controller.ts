import { CurrentUser, IAuthUser } from '@app/core/decorators/auth.decorators';
import { Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IResponse } from '@app/core/interfaces/response.interface';
import { RoomService } from './room.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RoomService } from './room.service';

@Controller({
  version: '1',
  path: '',
})
@ApiTags('Room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createRoom(@CurrentUser() user: IAuthUser): Promise<IResponse> {
    const newRoom = await this.roomService.createRoom(user.id);
    return {
      _data: newRoom,
      _metadata: {
        message: 'success',
        statusCode: HttpStatus.CREATED,
      },
    };
  }
}
