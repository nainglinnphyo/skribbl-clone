/* eslint-disable import/no-cycle */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Logger } from '@nestjs/common';
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
  transport: ['websocket'],
  cors: {
    origin: '*',
  },
  namespace: 'socket',
})
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
    const existRoom = await this.roomService.checkUserRoomExist(client.handshake.query.userId as string);
    if (existRoom) {
      this.sendRoom({ roomCode: existRoom.code as string, data: { msg: `${user.name} have leave room` }, event: 'user-leave-room' });
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
    this.logger.verbose(`emit user ${client.id}`);
    this.server.to(payload.roomCode).emit(payload.event, { data: payload.data });
  }
}
