import { Test, TestingModule } from '@nestjs/testing';

import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

describe('BoardsController', () => {
  let controller: BoardsController;
  let service: jest.Mocked<BoardsService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllByProject: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      updateInProject: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<BoardsService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [{ provide: BoardsService, useValue: service }],
    }).compile();

    controller = module.get<BoardsController>(BoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates board for project', async () => {
    service.create.mockResolvedValue({ id: 1 } as any);
    const res = await controller.createForProject(2, { name: 'B' } as any);
    expect(service.create).toHaveBeenCalledWith(2, { name: 'B' });
    expect(res).toEqual({ id: 1 });
  });

  it('lists boards for project', async () => {
    service.findAllByProject.mockResolvedValue([] as any);
    const res = await controller.findAllForProject(2);
    expect(service.findAllByProject).toHaveBeenCalledWith(2);
    expect(res).toEqual([]);
  });

  // standalone creation removed

  it('finds board', async () => {
    service.findOne.mockResolvedValue({ id: 4 } as any);
    const res = await controller.findOne(4);
    expect(service.findOne).toHaveBeenCalledWith(4);
    expect(res).toEqual({ id: 4 });
  });

  it('updates board', async () => {
    service.update.mockResolvedValue({ id: 5 } as any);
    const res = await controller.update(5, { name: 'X' } as any);
    expect(service.update).toHaveBeenCalledWith(5, { name: 'X' });
    expect(res).toEqual({ id: 5 });
  });

  it('updates board in project', async () => {
    service.updateInProject.mockResolvedValue({ id: 6 } as any);
    const res = await controller.updateInProject(1, 6, { name: 'Y' } as any);
    expect(service.updateInProject).toHaveBeenCalledWith(1, 6, { name: 'Y' });
    expect(res).toEqual({ id: 6 });
  });

  it('removes board', async () => {
    service.remove.mockResolvedValue({ id: 7 } as any);
    const res = await controller.remove(7);
    expect(service.remove).toHaveBeenCalledWith(7);
    expect(res).toEqual({ id: 7 });
  });
});
