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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardService } from 'src/common/interfaces/workspace';
import { type ClientGrpc } from '@nestjs/microservices';
import { GrpcUserMetadata } from 'src/common/decorators/grpc-user-metadata.decorator';
import { Metadata } from '@grpc/grpc-js';
import { toArray } from 'rxjs';

@Controller('projects/:projectId/boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  private boardService: BoardService;

  constructor(
    @Inject('WORKSPACE_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.boardService = this.client.getService<BoardService>('BoardService');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createForProject(
    @Param('projectId') projectId: number,
    @Body() createBoardDto: CreateBoardDto,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return this.boardService.createBoard(
      {
        ...createBoardDto,
        projectId,
      },
      metadata,
    );
  }

  @Get()
  findAllByProjectId(
    @Param('projectId') projectId: number,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return this.boardService
      .findBoardsByProjectId({ projectId }, metadata)
      .pipe(toArray());
  }

  @Get(':id')
  findByProjectId(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return this.boardService.findBoardById({ id, projectId }, metadata);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return await this.boardService.updateBoard(
      {
        ...updateBoardDto,
        id,
        projectId,
      },
      metadata,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return await this.boardService.deleteBoard({ id, projectId }, metadata);
  }
}
