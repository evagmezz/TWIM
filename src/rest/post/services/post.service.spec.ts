import {Test, TestingModule} from '@nestjs/testing'
import {PostService} from './post.service'
import {PostMapper} from "../mapper/post-mapper"
import {getRepositoryToken} from "@nestjs/typeorm"
import {Role, User} from "../../user/entities/user.entity"
import {Repository} from "typeorm"
import {getModelToken} from "@nestjs/mongoose"
import {Post} from "../entities/post.entity"
import {UserMapper} from "../../user/mapper/user-mapper"
import {CommentMapper} from "../../comment/mapper/comment-mapper"
import {Comment} from "../../comment/entities/comment.entity"
import {ResponseUserDto} from "../../user/dto/response-user.dto"
import {ResponsePostDto} from "../dto/response-post.dto"
import {StorageService} from "../../storage/services/ storage.service"
import {Readable} from "stream"
import {mock} from "jest-mock-extended"
import {Request} from "express"

describe('PostService', () => {
    let service: PostService
    let mapper: PostMapper

    const mockPostMapper = {
        toDto: jest.fn(),
        toEntity: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                {
                    provide: PostMapper,
                    useValue: mockPostMapper,
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
                    provide: getModelToken(Post.name),
                    useValue: {},
                },
                {
                    provide: UserMapper,
                    useValue: {},
                },
                {
                    provide: CommentMapper,
                    useValue: {},
                },
                {
                    provide: StorageService,
                    useValue: {},
                }
            ],
        }).compile()

        service = module.get<PostService>(PostService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('findAll', () => {
        it('should return an array of posts', async () => {
            const responseUserDto: ResponseUserDto = {
                id: '1',
                name: 'Test name',
                lastname: 'Test lastname',
                username: 'testusername',
                email: 'testemail',
                image: 'testimage',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
                followers: [],
            }
            const responseCommentDto: Comment = {
                _id: '1',
                userId: '1',
                postId: '1',
                content: 'Test content',
                createdAt: new Date(),
            }
            const responsePostDto: ResponsePostDto = {
                id: '1',
                user: responseUserDto,
                title: 'Test title',
                photos: ['testphoto'],
                location: 'Test location',
                createdAt: new Date(),
                updatedAt: new Date(),
                comments: [responseCommentDto],
                likes: ['1'],
            }

            const result = {
                docs: [responsePostDto],
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

            jest.spyOn(service, 'getUserByUserId').mockResolvedValue(responseUserDto)
            jest.spyOn(service, 'findAll').mockResolvedValue(result)
            expect(await service.findAll(1, 10, 'title', 'asc')).toEqual(result)
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
        it('should return a post', async () => {
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
            const responsePostDto: ResponsePostDto = {
                id: '1',
                user: responseUserDto,
                title: 'Test title',
                photos: ['testphoto'],
                location: 'Test location',
                createdAt: new Date(),
                updatedAt: new Date(),
                comments: [],
                likes: [],
            }

            const post = new Post()
            post._id = '1'
            post.userId = '1'
            post.title = 'Test title'
            post.photos = ['testphoto']
            post.location = 'Test location'
            post.createdAt = new Date()
            post.updatedAt = new Date()
            post.comments = []
            post.likes = []

            jest.spyOn(service, 'findOne').mockResolvedValue(responsePostDto)
            jest.spyOn(service, 'getUserByUserId').mockResolvedValue(responseUserDto)
            expect(await service.findOne('1')).toStrictEqual(responsePostDto)
        })
    })
    describe('create', () => {
        it('should create a post', async () => {
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
            const responsePostDto: ResponsePostDto = {
                id: '1',
                user: responseUserDto,
                title: 'Test title',
                photos: ['testphoto'],
                location: 'Test location',
                createdAt: new Date(),
                updatedAt: new Date(),
                comments: [],
                likes: [],
            }

            const createPostDto = {
                userId: '1',
                title: 'Test title',
                photos: ['testphoto'],
                location: 'Test location',
            }

            const files: Express.Multer.File[] = [
                {
                    fieldname: 'photo',
                    originalname: 'testphoto',
                    encoding: '7bit',
                    mimetype: 'image/jpeg',
                    destination: 'testdestination',
                    filename: 'testphoto',
                    path: 'testpath',
                    size: 1000,
                    stream: new Readable,
                    buffer: undefined
                },
            ]
            const req = mock<Request>()

            jest.spyOn(service, 'create').mockResolvedValue(responsePostDto)
            jest.spyOn(service, 'getUserByUserId').mockResolvedValue(responseUserDto)
            expect(await service.create(createPostDto, files, req)).toStrictEqual(responsePostDto)
        })
    })

    describe('update', () => {
        it('should update a post', async () => {
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
            const responsePostDto: ResponsePostDto = {
                id: '1',
                user: responseUserDto,
                title: 'Test title',
                photos: ['testphoto'],
                location: 'Test location',
                createdAt: new Date(),
                updatedAt: new Date(),
                comments: [],
                likes: [],
            }

            const updatePostDto = {
                title: 'Test title',
                location: 'Test location',
            }

            const post = new Post()
            post._id = '1'
            post.userId = '1'
            post.title = 'Test title'
            post.photos = ['testphoto']
            post.location = 'Test location'
            post.createdAt = new Date()
            post.updatedAt = new Date()
            post.comments = []
            post.likes = []

            jest.spyOn(service, 'update').mockResolvedValue(responsePostDto)
            jest.spyOn(service, 'getUserByUserId').mockResolvedValue(responseUserDto)
            expect(await service.update('1', updatePostDto)).toStrictEqual(responsePostDto)
        })
    })

    describe('remove', () => {
        it('should return a message', async () => {
            jest.spyOn(service, 'remove').mockImplementation(async () => {
                return
            })
        })
    })

describe('findPostsLikedByUser', () => {
        it('should return an array of posts', async () => {
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
            const responseCommentDto: Comment = {
                _id: '1',
                userId: '1',
                postId: '1',
                content: 'Test content',
                createdAt: new Date(),
            }
            const responsePostDto: ResponsePostDto = {
                id: '1',
                user: responseUserDto,
                title: 'Test title',
                photos: ['testphoto'],
                location: 'Test location',
                createdAt: new Date(),
                updatedAt: new Date(),
                comments: [responseCommentDto],
                likes: ['1'],
            }

            const allPosts = [responsePostDto]

            jest.spyOn(service, 'getUserByUserId').mockResolvedValue(responseUserDto)
            jest.spyOn(service, 'findPostsLikedByUser').mockResolvedValue(allPosts)
            expect(await service.findPostsLikedByUser('1')).toEqual(allPosts)
        })
    })

    describe('getUserByUsername', () => {
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

            jest.spyOn(service, 'getUserByUsername').mockImplementation(async () => user)
            expect(await service.getUserByUsername('testusername')).toStrictEqual(responseUserDto)
        })
    })
})
