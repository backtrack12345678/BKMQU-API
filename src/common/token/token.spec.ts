import { Test, TestingModule } from '@nestjs/testing';
import { Token } from './token';

describe('Token', () => {
  let provider: Token;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Token],
    }).compile();

    provider = module.get<Token>(Token);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
