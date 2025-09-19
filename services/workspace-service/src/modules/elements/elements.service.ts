import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { ElementDto } from './dto/element-dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ElementsService {
  constructor(
    private prisma: PrismaService,
    @Inject('EVENT_BUS') private readonly client: ClientProxy,
  ) {}

  async create(elementDto: ElementDto, userId: number) {
    const element = await this.prisma.element.create({
      data: {
        ...elementDto,
        userId,
      },
    });

    firstValueFrom(
      this.client.emit('element_created', {
        config: element.config,
        boardId: element.boardId,
        id: element.id,
        type: element.type,
      }),
    );

    return element;
  }

  async findAll(boardId: number, userId: number) {
    return this.prisma.element.findMany({
      where: { boardId, userId },
    });
  }

  async update({ id, boardId, ...data }: ElementDto) {
    const element = await this.prisma.element.update({
      where: { id, boardId },
      data,
    });

    firstValueFrom(
      this.client.emit('element_updated', {
        config: data.config,
        boardId: boardId,
        id,
        type: data.type,
      }),
    );

    return element;
  }

  async remove(boardId: number, id: string) {
    const element = await this.prisma.element.delete({
      where: { id, boardId },
    });

    firstValueFrom(
      this.client.emit('element_deleted', {
        id,
        boardId,
      }),
    );

    return element;
  }
}
