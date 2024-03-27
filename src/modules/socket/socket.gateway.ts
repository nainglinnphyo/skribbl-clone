/* eslint-disable import/no-cycle */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../room/room.service';

@WebSocketGateway({
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
  },
  namespace: 'socket',
})
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger(SocketGateway.name);

  private userMap = new Map();

  constructor(private roomService: RoomService) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Socket Initialized');
  }

  async handleDisconnect(client: Socket) {
    const user = await this.roomService.getRoomUser(client.handshake.query.userId as string);
    const existRoom:any
     = await this.roomService.checkUserRoomExist(client.handshake.query.userId as string);
    console.log(existRoom.code);
    if (existRoom) {
      this.roomService.userLeaveRoom(user.id, existRoom.id as string);
      this.sendRoom(
        { roomCode: existRoom.code as string, data: { msg: `${user.name} have leave room` }, event: 'user-leave-room' },
        client,
      );
      client.leave(existRoom.code as string);
    }
    this.userMap.delete(client.handshake.query.userId);
    this.logger.log('client disconnected ', client.id);
  }

  handleConnection(client: Socket) {
    this.userMap.set(client.handshake.query.userId, client.id);
    this.logger.log('client connected ', client.id);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(@MessageBody() payload: { roomCode: string; userId: string }, @ConnectedSocket() client?: Socket) {
    client.join(payload.roomCode);
    this.roomService.joinRoom(payload.roomCode, payload.userId);
    const user = await this.roomService.getRoomUser(payload.userId);
    this.sendRoom({ roomCode: payload.roomCode, event: 'user-join-room', data: { msg: `${user.name} have join room` } }, client);
    return 'join success';
  }

  @SubscribeMessage('sendRoom')
  sendRoom(@MessageBody() payload: { roomCode: string; event: string; data: any }, @ConnectedSocket() client?: Socket) {
    console.log('emit ', client.id);
    setTimeout(() => {
      this.server.to(payload.roomCode).emit('change-round', { ...payload.data });
    }, 4000);
    switch (payload.event) {
      case 'start-room':
        console.log('start-room');
        break;

      default:
        break;
    }
    this.server.to(payload.roomCode).emit(payload.event, { ...payload.data });
    return 'send room success';
  }
}
