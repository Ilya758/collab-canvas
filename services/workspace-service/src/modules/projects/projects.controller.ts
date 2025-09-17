import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { ProjectsService } from './projects.service';
import { type CreateProjectDto } from './dto/create-project.dto';
import { type UpdateProjectDto } from './dto/update-project.dto';
import { type User } from 'src/common/interfaces';
import { GrpcUser } from 'src/common/decorators/grpc-user.decorator';
import { from } from 'rxjs';
import { Action } from 'src/common/constants/action';
import { Resource } from 'src/common/constants/resource';
import { CheckResourcePolicy } from 'src/common/decorators/check-resource-policy.decorator';
import { PoliciesGuard } from 'src/common/guards/policies.guard';

@Controller()
@UseGuards(PoliciesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @GrpcMethod('WorkspaceService', 'CreateProject')
  createProject(@Payload() data: CreateProjectDto, @GrpcUser() user: User) {
    return this.projectsService.create(data, user.id);
  }

  @GrpcMethod('WorkspaceService', 'FindProjectsByUserId')
  async findProjectsByUserId(@Payload() data: { userId: number }) {
    return from(await this.projectsService.findByUserId(data.userId));
  }

  @GrpcMethod('WorkspaceService', 'UpdateProject')
  @CheckResourcePolicy({
    action: Action.UPDATE,
    resource: Resource.PROJECT,
    resourceIdParam: 'id',
    resourceType: 'project',
  })
  updateProject(@Payload() data: UpdateProjectDto) {
    return this.projectsService.update(data);
  }

  @GrpcMethod('WorkspaceService', 'DeleteProject')
  @CheckResourcePolicy({
    action: Action.DELETE,
    resource: Resource.PROJECT,
    resourceIdParam: 'id',
    resourceType: 'project',
  })
  deleteProject(@Payload() data: { id: number }) {
    return this.projectsService.remove(data.id);
  }
}
