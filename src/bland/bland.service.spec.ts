import { Test, TestingModule } from '@nestjs/testing';
import { BlandService } from './bland.service';

describe('BlandService', () => {
  let service: BlandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlandService],
    }).compile();

    service = module.get<BlandService>(BlandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
