import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ElementDto } from './dto/element-dto';

@Injectable()
export class ElementsService {
  constructor(private prisma: PrismaService) {}

  async create(elementDto: ElementDto, userId: number) {
    return this.prisma.element.create({
      data: {
        ...elementDto,
        userId,
      },
    });
  }

  async findAll(boardId: number, userId: number) {
    return this.prisma.element.findMany({
      where: { boardId, userId },
    });
  }

  async update({ id, boardId, ...data }: ElementDto) {
    return this.prisma.element.update({
      where: { id, boardId },
      data,
    });
  }

  async remove(boardId: number, id: string) {
    return this.prisma.element.delete({
      where: { id, boardId },
    });
  }
}
