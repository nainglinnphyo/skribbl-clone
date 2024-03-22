// eslint-disable-next-line import/no-extraneous-dependencies
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  transport: ['websocket'],
  cors: {
    origin: '*',
  },
  namespace: 'socket',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  afterInit(server: Server) {
    console.log(server);
    console.log('WebSocket gateway initialized');
    // Perform any initialization logic here
  }

  handleDisconnect(client: any) {
    console.log(client);
    throw new Error('Method not implemented.');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('client connected', client.id);
  }
}
