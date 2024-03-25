import { TestBed } from '@angular/core/testing'

import { MessageSharingServiceService } from './message-sharing-service.service'

describe('MessageSharingServiceService', () => {
  let service: MessageSharingServiceService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(MessageSharingServiceService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
