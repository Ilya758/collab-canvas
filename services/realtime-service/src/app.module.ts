import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [RealtimeModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
