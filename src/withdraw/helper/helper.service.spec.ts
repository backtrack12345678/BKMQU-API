import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawHelper } from './helper.service';

describe('HelperService', () => {
  let service: WithdrawHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawHelper],
    }).compile();

    service = module.get<WithdrawHelper>(WithdrawHelper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
