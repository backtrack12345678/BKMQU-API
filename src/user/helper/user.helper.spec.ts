import { Test, TestingModule } from '@nestjs/testing';
import { UserHelper } from './user.helper';

describe('User Helper', () => {
  let provider: UserHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserHelper],
    }).compile();

    provider = module.get<UserHelper>(UserHelper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
