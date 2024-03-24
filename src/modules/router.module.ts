import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesUserModule } from './route/router.user.module';
import { RoutesAuthModule } from './route/router.auth.module';
import { RoutesRoomModule } from './route/router.room.module';
import { SocketModule } from './socket/socket.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [];
    imports.push(
      SocketModule,
      RoutesUserModule,
      RoutesAuthModule,
      RoutesRoomModule,
      NestJsRouterModule.register([
        {
          path: '/auth',
          module: RoutesAuthModule,
        },
        {
          path: '/user',
          module: RoutesUserModule,
        },
        {
          path: '/room',
          module: RoutesRoomModule,
        },
      ]),
    );
    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
