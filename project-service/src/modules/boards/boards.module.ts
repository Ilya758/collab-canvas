import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  imports: [PrismaModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
