import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { Prisma } from '../../../generated/prisma';
import { PRISMA_ERROR_CODES } from '../../common/constants/prisma-error-codes';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create({ name, projectId }: CreateBoardDto, userId: number) {
    return await this.prisma.board
      .create({
        data: { name, projectId, authorId: userId },
        select: { id: true },
      })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
            throw new RpcException({
              code: GrpcStatus.ALREADY_EXISTS,
              message: 'Board name must be unique in project',
            });
          }
        }

        throw error;
      });
  }

  async findAllByProjectId(projectId: number, userId: number) {
    return await this.prisma.board.findMany({
      where: { projectId, authorId: userId },
      select: { id: true, name: true, authorId: true },
    });
  }

  async update({ id, ...data }: UpdateBoardDto) {
    return await this.prisma.board
      .update({ where: { id }, data, select: { id: true } })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
            throw new RpcException({
              code: GrpcStatus.ALREADY_EXISTS,
              message: 'Board name must be unique in project',
            });
          }
        }

        throw error;
      });
  }

  async remove(id: number, projectId: number) {
    return await this.prisma.board.delete({ where: { id, projectId } });
  }
}
