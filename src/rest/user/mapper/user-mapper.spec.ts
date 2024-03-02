import { Test, TestingModule } from '@nestjs/testing'
import { UserMapper } from './user-mapper'

describe('UserMapper', () => {
  let provider: UserMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMapper],
    }).compile()

    provider = module.get<UserMapper>(UserMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
