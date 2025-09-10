import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from 'generated/prisma';

import { Action, Resource } from '../../common/constants';
import { CheckResourcePolicy } from '../../common/decorators/check-resource-policy.decorator';
import { PoliciesGuard } from '../../common/guards/policies.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request & { user: User }) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  findByUserId(@Req() req: Request & { user: User }) {
    return this.projectsService.findByUserId(req.user.id);
  }

  @Get(':id')
  @CheckResourcePolicy({
    action: Action.READ,
    resource: Resource.PROJECT,
    resourceIdParam: 'id',
    resourceType: 'project',
  })
  findOne(@Param('id') id: number) {
    return this.projectsService.findOne(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  @CheckResourcePolicy({
    action: Action.UPDATE,
    resource: Resource.PROJECT,
    resourceIdParam: 'id',
    resourceType: 'project',
  })
  update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @CheckResourcePolicy({
    action: Action.DELETE,
    resource: Resource.PROJECT,
    resourceIdParam: 'id',
    resourceType: 'project',
  })
  remove(@Param('id') id: number) {
    return this.projectsService.remove(id);
  }
}
