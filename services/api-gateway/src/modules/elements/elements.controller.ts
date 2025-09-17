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

import { ElementDto } from './dto/element-dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { type ClientGrpc } from '@nestjs/microservices';
import { ElementService } from 'src/common/interfaces/workspace';
import { GrpcUserMetadata } from 'src/common/decorators/grpc-user-metadata.decorator';
import { Metadata } from '@grpc/grpc-js';
import { toArray } from 'rxjs';

@Controller('boards/:boardId/elements')
@UseGuards(JwtAuthGuard)
export class ElementsController {
  private elementsService: ElementService;

  constructor(
    @Inject('WORKSPACE_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.elementsService =
      this.client.getService<ElementService>('ElementService');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() elementDto: ElementDto,
    @Param('boardId') boardId: number,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return this.elementsService.createElement(
      {
        ...elementDto,
        boardId,
      },
      metadata,
    );
  }

  @Get()
  findAll(
    @Param('boardId') boardId: number,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return this.elementsService
      .findElementsByBoardId({ boardId }, metadata)
      .pipe(toArray());
  }

  @Get(':id')
  async findOne(
    @Param('boardId') boardId: number,
    @Param('id') id: string,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return this.elementsService.findElementById({ boardId, id }, metadata);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('boardId') boardId: number,
    @Param('id') id: string,
    @Body() updateElementDto: ElementDto,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return this.elementsService.updateElement(
      { ...updateElementDto, id, boardId },
      metadata,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('boardId') boardId: number,
    @Param('id') id: string,
    @GrpcUserMetadata() metadata: Metadata,
  ) {
    return this.elementsService.deleteElement({ id, boardId }, metadata);
  }
}
