import { Test, TestingModule } from '@nestjs/testing'
import { PostController } from './post.controller'
import { PostService } from '../services/post.service'

describe('PostController', () => {
    let controller: PostController
    let service: PostService

    beforeEach(async () => {
        const serviceMock = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            getAllComments: jest.fn(),
            findPostsLikedByUser: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        }
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostController],
            providers: [{ provide: PostService, useValue: serviceMock }]
        }).compile()

        controller = module.get<PostController>(PostController)
        service = module.get<PostService>(PostService)
    })

    it('should call findAll with correct parameters', async () => {
        const findAllSpy = jest.spyOn(service, 'findAll')
        await controller.findAll(1, 10, 'createdAt', 'asc')
        expect(findAllSpy).toHaveBeenCalledWith(1, 10, 'createdAt', 'asc')
    })

    it('should call findOne with correct parameters', async () => {
        const findOneSpy = jest.spyOn(service, 'findOne')
        await controller.findOne('uuid')
        expect(findOneSpy).toHaveBeenCalledWith('uuid')
    })

    it('should call getAllComments with correct parameters', async () => {
        const getAllCommentsSpy = jest.spyOn(service, 'getAllComments')
        await controller.getAllComments('uuid')
        expect(getAllCommentsSpy).toHaveBeenCalledWith('uuid')
    })

    it('should call findPostsLikedByUser with correct parameters', async () => {
        const findPostsLikedByUserSpy = jest.spyOn(service, 'findPostsLikedByUser')
        await controller.findPostsLikedByUser('uuid')
        expect(findPostsLikedByUserSpy).toHaveBeenCalledWith('uuid')
    })

    it('should call update with correct parameters', async () => {
        const updateSpy = jest.spyOn(service, 'update')
        const dto = {
            title: 'title',
            location: 'location',
        }
        await controller.update('uuid', dto)
        expect(updateSpy).toHaveBeenCalledWith('uuid', dto)
    })

    it('should call remove with correct parameters', async () => {
        const removeSpy = jest.spyOn(service, 'remove')
        await controller.remove('uuid')
        expect(removeSpy).toHaveBeenCalledWith('uuid')
    })
})