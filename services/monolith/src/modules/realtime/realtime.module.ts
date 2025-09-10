import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { AuthModule } from '../auth/auth.module';
import { RealtimeGateway } from './realtime.gateway';
import { WsAuthMiddleware } from './ws-auth.middleware';

@Module({
  imports: [AuthModule, PrismaModule, CommonModule],
  providers: [RealtimeGateway, WsAuthMiddleware],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
