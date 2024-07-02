import { Test, TestingModule } from '@nestjs/testing';
import { KajianService } from './kajian.service';

describe('KajianService', () => {
  let service: KajianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KajianService],
    }).compile();

    service = module.get<KajianService>(KajianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
