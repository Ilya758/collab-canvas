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
import { Action, Resource } from 'src/common/constants';
import { CheckResourcePolicy } from 'src/common/decorators/check-resource-policy.decorator';
import { PoliciesGuard } from 'src/common/guards/policies.guard';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('projects/:projectId/boards')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CheckResourcePolicy({
    action: Action.MANAGE,
    resource: Resource.PROJECT,
    resourceIdParam: 'projectId',
    resourceType: 'project',
  })
  createForProject(
    @Param('projectId') projectId: number,
    @Body() createBoardDto: CreateBoardDto,
    @Req() { user }: Request & { user: User },
  ) {
    return this.boardsService.create(createBoardDto, projectId, user.id);
  }

  @Get()
  @CheckResourcePolicy({
    action: Action.READ,
    resource: Resource.PROJECT,
    resourceIdParam: 'projectId',
    resourceType: 'project',
  })
  findAllForProject(
    @Param('projectId') projectId: number,
    @Req() { user }: Request & { user: User },
  ) {
    return this.boardsService.findAllByProjectId(projectId, user.id);
  }

  @Get(':id')
  @CheckResourcePolicy({
    action: Action.READ,
    resource: Resource.BOARD,
    resourceIdParam: 'id',
    resourceType: 'board',
  })
  findByProjectId(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Req() { user }: Request & { user: User },
  ) {
    return this.boardsService.findByProjectId(projectId, id, user.id);
  }

  @Patch(':id')
  @CheckResourcePolicy({
    action: Action.UPDATE,
    resource: Resource.BOARD,
    resourceIdParam: 'id',
    resourceType: 'board',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    await this.boardsService.updateInProject(projectId, id, updateBoardDto);
  }

  @Delete(':id')
  @CheckResourcePolicy({
    action: Action.DELETE,
    resource: Resource.BOARD,
    resourceIdParam: 'id',
    resourceType: 'board',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('projectId') projectId: number, @Param('id') id: number) {
    await this.boardsService.remove(id, projectId);
  }
}
