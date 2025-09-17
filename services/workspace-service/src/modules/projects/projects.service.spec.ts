import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PRISMA_ERROR_CODES } from '../../common/constants/prisma-error-codes';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from './projects.service';

type MockPrisma = {
  project: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    findFirst: jest.Mock;
  };
  board: {
    count: jest.Mock;
  };
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: MockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: {
            project: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findFirst: jest.fn(),
            },
            board: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a project', async () => {
      prisma.project.create.mockResolvedValue({
        id: 1,
        name: 'A',
        description: null,
      });
      const result = await service.create(
        {
          name: 'A',
        },
        1,
      );
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: { name: 'A', description: undefined },
        select: { id: true },
      });
      expect(result).toEqual({ id: 1, name: 'A', description: null });
    });

    it('maps unique constraint to ConflictException', async () => {
      prisma.project.create.mockRejectedValue({
        code: PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION,
      });
      await expect(
        service.create({ name: 'dup', description: undefined }, 1),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('findAll', () => {
    it('returns all projects with boards included', async () => {
      prisma.project.findMany.mockResolvedValue([]);
      const result = await service.findByUserId(1);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ authorId: 1 }, { authorId: null }],
        },
        include: { boards: true },
      });
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('returns a project by id with boards included', async () => {
      prisma.project.findUnique.mockResolvedValue({ id: 1, name: 'A' });
      const result = await service.findOne(1);
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { boards: true },
      });
      expect(result).toEqual({ id: 1, name: 'A' });
    });
  });

  describe('update', () => {
    it('updates a project', async () => {
      prisma.project.update.mockResolvedValue({ id: 1, name: 'B' });
      const result = await service.update({
        name: 'B',
        description: undefined,
        id: 1,
      });
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'B', description: undefined },
        select: { id: true },
      });
      expect(result).toEqual({ id: 1, name: 'B' });
    });

    it('maps unique constraint on update to ConflictException', async () => {
      prisma.project.update.mockRejectedValue({
        code: PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION,
      });
      await expect(
        service.update({ name: 'dup', description: undefined, id: 1 }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('remove', () => {
    it('deletes a project', async () => {
      prisma.board.count.mockResolvedValue(0);
      prisma.project.delete.mockResolvedValue({ id: 1 });
      const result = await service.remove(1);
      expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ id: 1 });
    });
  });
});
