// eslint-disable-next-line import/no-extraneous-dependencies
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Socket } from 'socket.io';

@WebSocketGateway({
  transport: ['websocket'],
  cors: {
    origin: '*',
  },
  namespace: 'socket',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleDisconnect(client: any) {
    console.log(client);
    throw new Error('Method not implemented.');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('client connected', client.id);
  }
}
