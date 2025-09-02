import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { CommonModule } from '../../common/common.module';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
