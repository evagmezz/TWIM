import { Test, TestingModule } from '@nestjs/testing';
import { PostMapper } from './post-mapper';

describe('PostMapper', () => {
  let provider: PostMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostMapper],
    }).compile();

    provider = module.get<PostMapper>(PostMapper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
