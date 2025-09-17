import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CommonModule } from 'src/common/common.module';
import { BoardsController } from './boards.controller';

@Module({
  imports: [CommonModule],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
