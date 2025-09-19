import { Module } from '@nestjs/common';

import { BoardsModule } from './modules/boards/boards.module';
import { ElementsModule } from './modules/elements/elements.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [ProjectsModule, BoardsModule, PrismaModule, ElementsModule],
})
export class AppModule {}
