import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WsAuthMiddleware } from 'src/modules/realtime/ws-auth.middleware';
import { RealtimeGateway } from './realtime.gateway';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../../../../proto/auth.proto'),
          url: 'auth-service:50051',
        },
      },
    ]),
  ],
  providers: [RealtimeGateway, WsAuthMiddleware],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
