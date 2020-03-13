import { Test, TestingModule } from '@nestjs/testing';
import { ChambersController } from './chambers.controller';
import { ChambersService } from './chambers.service';

describe('Chambers Controller', () => {
  let controller: ChambersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChambersController],
      providers: [ChambersService]
    }).compile();

    controller = module.get<ChambersController>(ChambersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
