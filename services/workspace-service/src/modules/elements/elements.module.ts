import { Module } from '@nestjs/common';

import { ElementsController } from './elements.controller';
import { ElementsService } from './elements.service';
import { CommonModule } from 'src/common/common.module';
import { EventBusModule } from 'src/common/clients/event-bus.module';

@Module({
  imports: [CommonModule, EventBusModule],
  controllers: [ElementsController],
  providers: [ElementsService],
  exports: [ElementsService],
})
export class ElementsModule {}
