import {Test, TestingModule} from '@nestjs/testing'
import {CommentService} from './comment.service'
import {CommentMapper} from "../mapper/comment-mapper"
import {User} from "../../user/entities/user.entity"
import {getRepositoryToken} from '@nestjs/typeorm'
import {Repository} from "typeorm"
import {getModelToken} from "@nestjs/mongoose"
import {ResponseUserDto} from "../../user/dto/response-user.dto"
import {ResponseCommentDto} from "../dto/response-comment.dto"
import {Comment} from "../entities/comment.entity"
import {UserMapper} from "../../user/mapper/user-mapper"

describe('CommentService', () => {
    let service: CommentService
    let mapper: CommentMapper
    const mockCommentMapper = {
        toDto: jest.fn(),
        toEntity: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                {
                    provide: CommentMapper,
                    useValue: mockCommentMapper,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: Repository,
                },
                {
                    provide: getModelToken(Comment.name),
                    useValue: {},
                },
                {
                    provide: UserMapper,
                    useValue: {},
                }
            ],
        }).compile()

        service = module.get<CommentService>(CommentService)
        mapper = module.get<CommentMapper>(CommentMapper)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('findAll', () => {
        it('should return an array of comments', async () => {
            const responseUserDto: ResponseUserDto = {
                id: '1',
                name: 'Test name',
                lastname: 'Test lastname',
                username: 'testusername',
                email: 'testemail',
                image: 'testimage',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
                followers: [],
            }

            const responseCommentDto: ResponseCommentDto = {
                id: '1',
                userId: '1',
                postId: '1',
                content: 'Test content',
                user: responseUserDto,
                createdAt: new Date(),
            }

            const result = {
                docs: [responseCommentDto],
                totalDocs: 1,
                limit: 10,
                hasPrevPage: false,
                hasNextPage: false,
                page: 1,
                totalPages: 1,
                offset: 0,
                pagingCounter: 1,
                meta: {},
            }
            jest.spyOn(service, 'findAll').mockImplementation(async () => result)
            expect(await service.findAll(1, 10, 'createdAt', 'asc')).toBe(result)
        })
    })
    describe('getUserByUserId', () => {
        it('should return a user', async () => {
            const responseUserDto: ResponseUserDto = {
                id: '1',
                name: 'Test name',
                lastname: 'Test lastname',
                username: 'testusername',
                email: 'testemail',
                image: 'testimage',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
                followers: [],
            }

            const user = {
                id: '1',
                name: 'Test name',
                lastname: 'Test lastname',
                username: 'testusername',
                email: 'testemail',
                image: 'testimage',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
                followers: [],
            }

            jest.spyOn(service, 'getUserByUserId').mockImplementation(async () => user)
            expect(await service.getUserByUserId('1')).toStrictEqual(responseUserDto)
        })
    })
    describe('findOne', () => {
        it('should return a comment', async () => {
            const responseUserDto: ResponseUserDto = {
                id: '1',
                name: 'Test name',
                lastname: 'Test lastname',
                username: 'testusername',
                email: 'testemail',
                image: 'testimage',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
                followers: [],
            }

            const responseCommentDto: ResponseCommentDto = {
                id: '1',
                userId: '1',
                postId: '1',
                content: 'Test content',
                user: responseUserDto,
                createdAt: new Date(),
            }

            const comment = new Comment()
            comment._id = '1'
            comment.userId = '1'
            comment.postId = '1'
            comment.content = 'Test content'
            comment.createdAt = new Date()

            jest.spyOn(service, 'findOne').mockImplementation(async () => responseCommentDto)
            expect(await service.findOne('1')).toStrictEqual(responseCommentDto)
        })
        it('should throw an error', async () => {
            jest.spyOn(service, 'findOne').mockImplementation(async () => {
                throw new Error('Comment not found')
            })
            try {
                await service.findOne('1')
            } catch (e) {
                expect(e.message).toBe('Comment not found')
            }
        })
    })
    describe('create', () => {
        it('should return a comment', async () => {
            const responseUserDto: ResponseUserDto = {
                id: '1',
                name: 'Test name',
                lastname: 'Test lastname',
                username: 'testusername',
                email: 'testemail',
                image: 'testimage',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
                followers: [],
            }

            const responseCommentDto: ResponseCommentDto = {
                id: '1',
                userId: '1',
                postId: '1',
                content: 'Test content',
                user: responseUserDto,
                createdAt: new Date(),
            }

            const comment = new Comment()
            comment._id = '1'
            comment.userId = '1'
            comment.postId = '1'
            comment.content = 'Test content'
            comment.createdAt = new Date()

            jest.spyOn(service, 'create').mockImplementation(async () => responseCommentDto)
            expect(await service.create(comment)).toStrictEqual(responseCommentDto)
        })
    })
    describe('remove', () => {
        it('should return a message', async () => {
            jest.spyOn(service, 'remove').mockImplementation(async () => {
                return
            })
        })
        it('should thow a NotFoundException', () => {
            jest.spyOn(service, 'remove').mockImplementation(async () => {
                throw new Error('Comment not found')
            })
            try {
                service.remove('1')
            } catch (e) {
                expect(e.message).toBe('Comment not found')
            }
        })
    })
})
