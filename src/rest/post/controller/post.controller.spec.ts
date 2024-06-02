import {Test, TestingModule} from '@nestjs/testing'
import {PostController} from './post.controller'
import {PostService} from '../services/post.service'
import {CacheModule} from "@nestjs/cache-manager"
import {ResponsePostDto} from "../dto/response-post.dto"
import {NotFoundException} from "@nestjs/common"
import {CreatePostDto} from "../dto/create-post.dto"
import { Request } from 'express'
import {UpdatePostDto} from "../dto/update-post.dto"

describe('PostController', () => {
    let controller: PostController
    let service: PostService

    const mockPostService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        getAllComments: jest.fn(),
        findPostsLikedByUser: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CacheModule.register()],
            controllers: [PostController],
            providers: [
                {
                    provide: PostService,
                    useValue: mockPostService,
                },
            ],
        }).compile()
        controller = module.get<PostController>(PostController)
        service = module.get<PostService>(PostService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
    describe('findAll', () => {
        it('should return a paginated list of posts', async () => {
            const paginateOptions = {
                page: 1,
                limit: 10,
                orderBy: 'createdAt',
                order: 'asc',
            }
            const page: any = {
                docs: [],
                totalDocs: 0,
                totalPages: 0,
                hasNextPage: false,
                nextPage: null,
                hasPrevPage: false,
                prevPage: null,
                pagingCounter: 1,
                meta: null,
            }
            jest.spyOn(service, 'findAll').mockResolvedValue(page)
            const result: any = await controller.findAll(paginateOptions.page, paginateOptions.limit, paginateOptions.orderBy, paginateOptions.order)

            expect(result.totalPages).toEqual(0)
            expect(service.findAll).toHaveBeenCalled()
        })
    })
    describe('findOne', () => {
        it('should return a post', async () => {
            const id = 'uuid'
            const result: ResponsePostDto = new ResponsePostDto()
            jest.spyOn(service, 'findOne').mockResolvedValue(result)
            await controller.findOne(id)
            expect(service.findOne).toHaveBeenCalledWith(id)
            expect(result).toBeInstanceOf(ResponsePostDto)
        })
        it('should throw a NotFoundException', async () => {
            const id = 'uuid'
            jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
            await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
        })
    })
    describe('getAllComments', () => {
        it('should return a list of comments', async () => {
            const id = 'uuid'
            const result: any = []
            jest.spyOn(service, 'getAllComments').mockResolvedValue(result)
            await controller.getAllComments(id)
            expect(service.getAllComments).toHaveBeenCalledWith(id)
            expect(result).toBeInstanceOf(Array)
        })
    })
    describe('findPostsLikedByUser', () => {
        it('should return a list of posts liked by user', async () => {
            const userId = 'uuid'
            const result: any = []
            jest.spyOn(service, 'findPostsLikedByUser').mockResolvedValue(result)
            await controller.findPostsLikedByUser(userId)
            expect(service.findPostsLikedByUser).toHaveBeenCalledWith(userId)
            expect(result).toBeInstanceOf(Array)
        })
    })
    describe('create', () => {
        it('should create a post', async () => {
            const dto: CreatePostDto = {
                title: 'title',
                photos: [],
                location: 'location',
                userId: 'uuid',
            }
                const mockFile: Express.Multer.File = {
                fieldname: 'image',
                originalname: 'test.jpg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: Buffer.from('test'),
                size: 4,
                destination: './photos',
                filename: 'test.jpg',
                path: './photos/test.jpg',
                stream: null,
            }
            const files: Array<Express.Multer.File> = [mockFile]
            const result: ResponsePostDto = new ResponsePostDto()
            const req: Partial<Request> = {}

            jest.spyOn(service, 'create').mockResolvedValue(result)
            const response = await controller.create(files, dto, req as Request)

            expect(service.create).toHaveBeenCalledWith(dto, files, req)
            expect(response).toBeInstanceOf(ResponsePostDto)
            expect(response).toEqual(result)
        })
    })
    describe('update', () => {
        it('should update a post', async () => {
            const id = 'uuid'
            const dto: UpdatePostDto = {
                title: 'title',
                location: 'location',
            }
            const result: ResponsePostDto = new ResponsePostDto()
            jest.spyOn(service, 'update').mockResolvedValue(result)
            await controller.update(id, dto)
            expect(service.update).toHaveBeenCalledWith(id, dto)
            expect(result).toBeInstanceOf(ResponsePostDto)
        })
    })
    describe('remove', () => {
        it('should remove a post', async () => {
            const id = 'uuid'
            jest.spyOn(service, 'remove').mockResolvedValue()

            await controller.remove(id)

            expect(service.remove).toHaveBeenCalledWith(id)
        })
    })
})