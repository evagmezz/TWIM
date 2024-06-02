import { Test, TestingModule } from '@nestjs/testing'
import { CommentController } from './comment.controller'
import { CommentService } from '../services/comment.service'

describe('CommentController', () => {
  let controller: CommentController
  let service: CommentService

  beforeEach(async () => {
    const serviceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPostId: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [{ provide: CommentService, useValue: serviceMock }]
    }).compile()

    controller = module.get<CommentController>(CommentController)
    service = module.get<CommentService>(CommentService)
  })

  it('should call findAll with correct parameters', async () => {
    const findAllSpy = jest.spyOn(service, 'findAll')
    await controller.findAll(1, 10, 'userId', 'asc')
    expect(findAllSpy).toHaveBeenCalledWith(1, 10, 'userId', 'asc')
  })

    it('should call findOne with correct parameters', async () => {
        const findOneSpy = jest.spyOn(service, 'findOne')
        await controller.findOne('id')
        expect(findOneSpy).toHaveBeenCalledWith('id')
    })

    it('should call findByPostId with correct parameters', async () => {
        const findByPostIdSpy = jest.spyOn(service, 'findByPostId')
        await controller.findByPostId('postId')
        expect(findByPostIdSpy).toHaveBeenCalledWith('postId')
    })

    it('should call create with correct parameters', async () => {
        const createSpy = jest.spyOn(service, 'create')
        await controller.create({} as any)
        expect(createSpy).toHaveBeenCalledWith({})
    })

    it('should call remove with correct parameters', async () => {
        const removeSpy = jest.spyOn(service, 'remove')
        await controller.remove('id')
        expect(removeSpy).toHaveBeenCalledWith('id')
    })
})
