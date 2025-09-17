import { Module } from '@nestjs/common';

import { BoardsController } from './boards.controller';
import { WorkspaceClientModule } from 'src/common/clients/workspace-client.module';

@Module({
  imports: [WorkspaceClientModule],
  controllers: [BoardsController],
})
export class BoardsModule {}
