import { Test, TestingModule } from '@nestjs/testing';
import { AktivitasService } from './aktivitas.service';

describe('AktivitasService', () => {
  let service: AktivitasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AktivitasService],
    }).compile();

    service = module.get<AktivitasService>(AktivitasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
