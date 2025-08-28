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
} from '@nestjs/common';

import { EntityExistsPipe } from '../../common/pipes/entity-exists.pipe';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller()
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post('projects/:projectId/boards')
  @HttpCode(HttpStatus.CREATED)
  createForProject(
    @Param('projectId', EntityExistsPipe('project')) projectId: number,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    return this.boardsService.create(projectId, createBoardDto);
  }

  @Get('projects/:projectId/boards')
  findAllForProject(@Param('projectId', EntityExistsPipe('project')) projectId: number) {
    return this.boardsService.findAllByProject(projectId);
  }

  @Get('boards')
  findAll() {
    return this.boardsService.findAll();
  }

  @Get('boards/:id')
  findOne(@Param('id', EntityExistsPipe('board')) id: number) {
    return this.boardsService.findOne(id);
  }

  @Patch('boards/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id', EntityExistsPipe('board')) id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardsService.update(id, updateBoardDto);
  }

  @Patch('projects/:projectId/boards/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateInProject(
    @Param('projectId', EntityExistsPipe('project')) projectId: number,
    @Param('id', EntityExistsPipe('board')) id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardsService.updateInProject(projectId, id, updateBoardDto);
  }

  @Delete('boards/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', EntityExistsPipe('board')) id: number) {
    return this.boardsService.remove(id);
  }
}
