import { Test, TestingModule } from '@nestjs/testing'
import { LocationMapper } from './location-mapper'

describe('LocationMapper', () => {
  let provider: LocationMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationMapper],
    }).compile()

    provider = module.get<LocationMapper>(LocationMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
