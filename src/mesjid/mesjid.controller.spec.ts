import { Test, TestingModule } from '@nestjs/testing';
import { MesjidController } from './mesjid.controller';
import { MesjidService } from './mesjid.service';

describe('MesjidController', () => {
  let controller: MesjidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MesjidController],
      providers: [MesjidService],
    }).compile();

    controller = module.get<MesjidController>(MesjidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
