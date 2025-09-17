import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../generated/prisma';
import { PRISMA_ERROR_CODES } from '../../common/constants/prisma-error-codes';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, userId: number) {
    return await this.prisma.project
      .create({ data: { ...createProjectDto, authorId: userId }, select: { id: true } })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
            throw new RpcException({
              code: GrpcStatus.ALREADY_EXISTS,
              message: 'Project with this name already exists',
            });
          }
        }

        throw error;
      });
  }

  async findByUserId(userId: number) {
    const projects = await this.prisma.project.findMany({
      where: {
        OR: [
          {
            authorId: userId,
          },
          {
            authorId: null,
          },
        ],
      },
      include: { boards: true },
    });

    return projects;
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { boards: true },
    });
  }

  async update({ id, ...data }: UpdateProjectDto) {
    await this.prisma.project
      .update({ where: { id }, data: data, select: { id: true } })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
            throw new RpcException({
              code: GrpcStatus.ALREADY_EXISTS,
              message: 'Project with this name already exists',
            });
          }
        }

        throw error;
      });
  }

  async remove(id: number) {
    const boardsCount = await this.prisma.board.count({
      where: { projectId: id },
    });

    if (boardsCount) {
      throw new RpcException({
        code: GrpcStatus.ALREADY_EXISTS,
        message: 'Cannot delete project with existing boards',
      });
    }

    return this.prisma.project.delete({ where: { id } });
  }
}
