import { Test, TestingModule } from '@nestjs/testing';
import { BlandController } from './bland.controller';

describe('BlandController', () => {
  let controller: BlandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlandController],
    }).compile();

    controller = module.get<BlandController>(BlandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
