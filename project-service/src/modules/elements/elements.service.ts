import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { RealtimeGateway } from '../realtime/realtime.gateway';
import { ElementDto } from './dto/element-dto';

@Injectable()
export class ElementsService {
  constructor(
    private prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async create(elementDto: ElementDto, boardId: number, userId: number) {
    const element = await this.prisma.element.create({
      data: {
        ...elementDto,
        boardId,
        userId,
      },
      select: {
        id: true,
      },
    });

    this.realtimeGateway.server.to(boardId.toString()).emit('elementCreated', element);

    return element;
  }

  async findAll(boardId: number, userId: number) {
    return await this.prisma.element.findMany({
      where: { boardId, userId },
    });
  }

  async findOne(boardId: number, id: string, userId: number) {
    return await this.prisma.element.findUnique({
      where: { id, boardId, userId },
    });
  }

  async update(boardId: number, id: string, elementDto: ElementDto) {
    const element = await this.prisma.element.update({
      where: { id, boardId },
      data: elementDto,
    });

    this.realtimeGateway.server.to(boardId.toString()).emit('elementUpdated', element);

    return element;
  }

  async remove(boardId: number, id: string) {
    const element = await this.prisma.element.delete({
      where: { id, boardId },
    });

    this.realtimeGateway.server.to(boardId.toString()).emit('elementRemoved', element);

    return element;
  }
}
