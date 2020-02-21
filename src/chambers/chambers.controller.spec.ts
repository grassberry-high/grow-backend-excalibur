import { Test, TestingModule } from '@nestjs/testing';
import { ChambersController } from './chambers.controller';

describe('Chambers Controller', () => {
  let controller: ChambersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChambersController],
    }).compile();

    controller = module.get<ChambersController>(ChambersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
