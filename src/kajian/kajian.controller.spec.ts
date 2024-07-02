import { Test, TestingModule } from '@nestjs/testing';
import { KajianController } from './kajian.controller';
import { KajianService } from './kajian.service';

describe('KajianController', () => {
  let controller: KajianController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KajianController],
      providers: [KajianService],
    }).compile();

    controller = module.get<KajianController>(KajianController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
