import { Module } from '@nestjs/common';

import { EventsController } from './events.controller';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [RealtimeModule],
  controllers: [EventsController],
})
export class EventsModule {}
