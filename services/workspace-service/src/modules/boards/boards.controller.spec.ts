import { Test, TestingModule } from '@nestjs/testing';

import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

describe('BoardsController', () => {
  let controller: BoardsController;
  let service: jest.Mocked<BoardsService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAllByProjectId: jest.fn(),
      findAllByProject: jest.fn(),
      updateBoard: jest.fn(),
      deleteBoard: jest.fn(),
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
});
