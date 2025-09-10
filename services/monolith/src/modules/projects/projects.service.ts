import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { Prisma } from '../../../generated/prisma';
import { PRISMA_ERROR_CODES } from '../../common/constants/prisma-error-codes';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, userId: number) {
    return await this.prisma.project
      .create({ data: { ...createProjectDto, authorId: userId }, select: { id: true } })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
            throw new ConflictException('Project with this name already exists');
          }
        }

        throw error;
      });
  }

  findByUserId(userId: number) {
    return this.prisma.project.findMany({
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
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { boards: true },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return await this.prisma.project
      .update({ where: { id }, data: updateProjectDto, select: { id: true } })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
            throw new ConflictException('Project with this name already exists');
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
      throw new ConflictException('Cannot delete project with existing boards');
    }

    return this.prisma.project.delete({ where: { id } });
  }
}
