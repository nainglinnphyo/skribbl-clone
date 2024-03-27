import { CurrentUser, IAuthUser } from '@app/core/decorators/auth.decorators';
import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { IResponse } from '@app/core/interfaces/response.interface';
import { RoomService } from './room.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoomDto } from './room.dto';
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
  @ApiBody({
    type: CreateRoomDto,
  })
  async createRoom(@CurrentUser() user: IAuthUser, @Body() body: CreateRoomDto): Promise<IResponse> {
    const newRoom = await this.roomService.createRoom(user.id, body);
    return {
      _data: newRoom,
      _metadata: {
        message: 'success',
        statusCode: HttpStatus.CREATED,
      },
    };
  }
}
