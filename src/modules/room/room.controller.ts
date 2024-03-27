import { CurrentUser, IAuthUser } from '@app/core/decorators/auth.decorators';
import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
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

  @Get('user/:roomCode')
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getRoomUser(@Param('roomCode') roomCode: string): Promise<IResponse> {
    const users = await this.roomService.getRoomUserList(roomCode);
    return {
      _metadata: {
        message: 'fetch success',
        statusCode: HttpStatus.OK,
      },
      _data: users,
    };
  }

  @Get('random-word')
  async getRandomWord() {
    return this.roomService.getRandomWord();
  }

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
