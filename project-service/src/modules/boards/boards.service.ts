import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { Prisma } from '../../../generated/prisma';
import { PRISMA_ERROR_CODES } from '../../common/constants/prisma-error-codes';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create(projectId: number, createBoardDto: CreateBoardDto) {
    return await this.prisma.board
      .create({
        data: { name: createBoardDto.name, projectId },
        select: { id: true },
      })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
            throw new ConflictException('Board name must be unique in project');
          }
        }

        throw error;
      });
  }

  findAll() {
    return this.prisma.board.findMany();
  }

  findAllByProject(projectId: number) {
    return this.prisma.board.findMany({ where: { projectId } });
  }

  findOne(id: number) {
    return this.prisma.board.findUnique({ where: { id } });
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    return await this.prisma.board
      .update({ where: { id }, data: updateBoardDto, select: { id: true } })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
            throw new ConflictException('Board name must be unique in project');
          }
        }

        throw error;
      });
  }

  async updateInProject(projectId: number, id: number, updateBoardDto: UpdateBoardDto) {
    const board = await this.prisma.board.findUnique({
      where: { id },
      select: { id: true, projectId: true },
    });

    if (!board || board.projectId !== projectId) {
      throw new NotFoundException('Board not found');
    }

    return await this.update(id, updateBoardDto);
  }

  remove(id: number) {
    return this.prisma.board.delete({ where: { id } });
  }
}
