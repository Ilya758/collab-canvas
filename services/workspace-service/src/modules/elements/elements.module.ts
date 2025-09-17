import { Module } from '@nestjs/common';

import { ElementsController } from './elements.controller';
import { ElementsService } from './elements.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ElementsController],
  providers: [ElementsService],
  exports: [ElementsService],
})
export class ElementsModule {}
