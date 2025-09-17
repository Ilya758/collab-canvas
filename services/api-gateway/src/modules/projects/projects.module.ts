import { Module } from '@nestjs/common';
import { WorkspaceClientModule } from 'src/common/clients/workspace-client.module';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [WorkspaceClientModule],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
