import { Module } from '@nestjs/common';
import { ElementsController } from './elements.controller';
import { WorkspaceClientModule } from 'src/common/clients/workspace-client.module';

@Module({
  imports: [WorkspaceClientModule],
  controllers: [ElementsController],
})
export class ElementsModule {}
