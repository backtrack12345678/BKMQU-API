import { Test, TestingModule } from '@nestjs/testing';
import { KasController } from './kas.controller';
import { KasService } from './kas.service';

describe('KasController', () => {
  let controller: KasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KasController],
      providers: [KasService],
    }).compile();

    controller = module.get<KasController>(KasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
