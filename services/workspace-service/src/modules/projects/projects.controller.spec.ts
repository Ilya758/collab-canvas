import { Test, TestingModule } from '@nestjs/testing';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: any;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsService, useValue: service }],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to service', async () => {
    (service.create as jest.Mock).mockResolvedValue({ id: 1 });
    const dto = { name: 'A' };
    const res = await controller.createProject({ name: 'A' }, { id: 1 } as any);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ id: 1 });
  });

  it('findAll delegates to service', async () => {
    (service.findAll as jest.Mock).mockResolvedValue([]);
    const res = await controller.findProjectsByUserId({ userId: 1 });
    expect(service.findAll).toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  it('update delegates to service', async () => {
    (service.update as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await controller.updateProject({ id: 1, name: 'B' });
    expect(service.update).toHaveBeenCalledWith(1, { name: 'B' });
    expect(res).toEqual({ id: 1 });
  });

  it('remove delegates to service', async () => {
    (service.remove as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await controller.deleteProject({ id: 1 });
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(res).toEqual({ id: 1 });
  });
});
