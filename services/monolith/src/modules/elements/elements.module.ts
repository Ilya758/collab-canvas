import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { RealtimeModule } from '../realtime/realtime.module';
import { ElementsController } from './elements.controller';
import { ElementsService } from './elements.service';

@Module({
  imports: [PrismaModule, CommonModule, RealtimeModule],
  providers: [ElementsService],
  controllers: [ElementsController],
})
export class ElementsModule {}
