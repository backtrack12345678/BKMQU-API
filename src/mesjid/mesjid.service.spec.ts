import { Test, TestingModule } from '@nestjs/testing';
import { MesjidService } from './mesjid.service';

describe('MesjidService', () => {
  let service: MesjidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MesjidService],
    }).compile();

    service = module.get<MesjidService>(MesjidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
