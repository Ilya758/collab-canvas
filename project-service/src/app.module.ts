import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { BoardsModule } from './modules/boards/boards.module';
import { HealthController } from './modules/health/health.controller';
import { PrismaHealthIndicator } from './modules/health/prisma.health';
import { ProjectsModule } from './modules/projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AppConfigModule,
    ProjectsModule,
    BoardsModule,
    PrismaModule,
    TerminusModule,
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, PrismaHealthIndicator],
})
export class AppModule {}
