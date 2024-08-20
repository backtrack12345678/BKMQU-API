import { Test, TestingModule } from '@nestjs/testing';
import { AdminHelper } from './admin.helper';

describe('AdminHelper', () => {
  let provider: AdminHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminHelper],
    }).compile();

    provider = module.get<AdminHelper>(AdminHelper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
