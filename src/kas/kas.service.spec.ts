import { Test, TestingModule } from '@nestjs/testing';
import { KasService } from './kas.service';

describe('KasService', () => {
  let service: KasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KasService],
    }).compile();

    service = module.get<KasService>(KasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
