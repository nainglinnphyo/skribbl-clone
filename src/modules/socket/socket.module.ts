import { Global, Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { RoutesRoomModule } from '../route/router.room.module';

@Global()
@Module({
  imports: [RoutesRoomModule],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
