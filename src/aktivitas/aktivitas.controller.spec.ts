import { Test, TestingModule } from '@nestjs/testing';
import { AktivitasController } from './aktivitas.controller';
import { AktivitasService } from './aktivitas.service';

describe('AktivitasController', () => {
  let controller: AktivitasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AktivitasController],
      providers: [AktivitasService],
    }).compile();

    controller = module.get<AktivitasController>(AktivitasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
