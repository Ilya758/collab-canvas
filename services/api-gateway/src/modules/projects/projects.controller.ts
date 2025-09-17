import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/common/interfaces';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { toArray } from 'rxjs';
import { GrpcUserMetadata } from 'src/common/decorators/grpc-user-metadata.decorator';
import { WorkspaceService } from 'src/common/interfaces/workspace';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  private workspaceService: WorkspaceService;
  constructor(
    @Inject('WORKSPACE_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.workspaceService =
      this.client.getService<WorkspaceService>('WorkspaceService');
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return this.workspaceService.createProject(createProjectDto, metadata);
  }

  @Get()
  findByUserId(
    @Req() req: Request & { user: User },
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return this.workspaceService
      .findProjectsByUserId({ userId: req.user.id }, metadata)
      .pipe(toArray());
  }

  @Get(':id')
  findOne(@Param('id') id: number, @GrpcUserMetadata() metadata: Metadata) {
    return this.workspaceService.findProjectById({ id }, metadata);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return this.workspaceService.updateProject(
      { ...updateProjectDto, id },
      metadata,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number, @GrpcUserMetadata() metadata: Metadata) {
    return this.workspaceService.deleteProject({ id }, metadata);
  }
}
