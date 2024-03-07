import { Test, TestingModule } from '@nestjs/testing'
import { CommentMapper } from './comment-mapper'

describe('CommentMapper', () => {
  let provider: CommentMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentMapper],
    }).compile()

    provider = module.get<CommentMapper>(CommentMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
