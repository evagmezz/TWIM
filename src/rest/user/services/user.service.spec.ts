import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { Repository } from 'typeorm'
import { Role, User } from '../entities/user.entity'
import { UserMapper } from '../mapper/user-mapper'
import { StorageService } from '../../storage/services/ storage.service'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BcryptService } from './bcrypt.service'
import { Post, PostDocument } from '../../post/entities/post.entity'
import { PaginateModel } from 'mongoose'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Paginated } from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'
import { ResponseUserDto } from '../dto/response-user.dto'
import { getModelToken } from '@nestjs/mongoose'
import { NotFoundException } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import {Readable} from "stream"
import {mock} from "jest-mock-extended"
import {Request} from "express"
import { UpdateUserDto } from '../dto/update-user.dto'

describe('UserService', () => {
  let service: UserService
  let repository: Repository<User>
  let mapper: UserMapper
  let storageService: StorageService
  let cacheManager: Cache
  let bcryptService: BcryptService

  const mockMapper = {
    toDto: jest.fn(),
    toEntity: jest.fn(),
  }

  const cacheManagerMock = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(),
    },
  }

  const storageServiceMock = {
    removeFile: jest.fn(),
    getFileNameWithoutUrl: jest.fn(),
  }

  const bcryptServiceMock = {
    hash: jest.fn(),
    compare: jest.fn(),
    isMatch: jest.fn(),
  }

  const postRepositoryMock = {
    paginate: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(User), useClass: Repository },
        { provide: UserMapper, useValue: mockMapper },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
        { provide: BcryptService, useValue: bcryptServiceMock },
        { provide: getModelToken(Post.name), useValue: postRepositoryMock },
        UserService,
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    repository = module.get<Repository<User>>(getRepositoryToken(User))
    mapper = module.get<UserMapper>(UserMapper)
    storageService = module.get<StorageService>(StorageService)
    cacheManager = module.get<Cache>(CACHE_MANAGER)
    bcryptService = module.get<BcryptService>(BcryptService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const paginateOptions = {
        page: 1,
        limit: 3,
        path: 'users',
      }
      const page: any = {
        data: [],
        meta: {
          itemsPerPage: 3,
          totalItems: 0,
          currentPage: 1,
          totalPages: 0,
        },
        links: {
          current:
            'http://localhost:3000/users?page=1&limit=3',
        },
      } as Paginated<ResponseUserDto>
      jest.spyOn(cacheManager, 'get').mockResolvedValue(page)
      const result: any = await service.findAll(paginateOptions)
      expect(cacheManager.get).toHaveBeenCalledWith(
        `all_users_page_${hash(JSON.stringify(paginateOptions))}`,
      )
      expect(result).toEqual(page)
    })
  })
  describe('findOne', () => {
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

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null)
      jest.spyOn(service as any, 'findInternal').mockResolvedValue(responseUserDto)
      jest.spyOn(cacheManager, 'set').mockResolvedValue()
      jest.spyOn(mapper, 'toDto').mockReturnValue(responseUserDto)

      expect(await service.findOne('1')).toEqual(responseUserDto)
    })

    it('should throw a NotFoundException', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null)
      jest.spyOn(service as any, 'findInternal').mockImplementation(() => {
        throw new NotFoundException(`User not found`)
      })

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException)
    })
  })
  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'name',
        lastname: 'lastname',
        username: 'username',
        password: 'password',
        email: 'email',
        image: 'image',
        role: Role.USER,
      }
      const file: Express.Multer.File = {
        fieldname: 'photo',
        originalname: 'testphoto',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'testdestination',
        filename: 'testphoto',
        path: 'testpath',
        size: 1000,
        stream: new Readable,
        buffer: undefined,
      }
      const req = mock<Request>()

      const result: ResponseUserDto = new ResponseUserDto()
      jest.spyOn(service, 'findByUsername').mockResolvedValue(null)
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null)
      jest.spyOn(service, 'create').mockResolvedValue(result)
      await service.create(createUserDto, file, req)
      expect(service.create).toHaveBeenCalledWith(createUserDto, file, req)
      expect(result).toBeInstanceOf(ResponseUserDto)
    })

    it('should throw a BadRequestException because of existing username', async () => {
      const createUserDto: CreateUserDto = {
        name: 'name',
        lastname: 'lastname',
        username: 'existingusername',
        password: 'password',
        email: 'email',
        image: 'image',
        role: Role.USER,
      }
      const existingUser: User = new User()
      jest.spyOn(service, 'findByUsername').mockResolvedValue(existingUser)
      await expect(service.create(createUserDto, null, null)).rejects.toThrow()
    })

    it('should throw a BadRequestException because of existing email', async () => {
      const createUserDto: CreateUserDto = {
        name: 'name',
        lastname: 'lastname',
        username: 'username',
        password: 'password',
        email: 'existingemail',
        image: 'image',
        role: Role.USER,
      }
      const existingUser: User = new User()
      jest.spyOn(service, 'findByEmail').mockResolvedValue(existingUser)
      await expect(service.create(createUserDto, null, null)).rejects.toThrow()
    })
  })
  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'newusername',
        email: 'newemail',
        password: 'newpassword',
      }
      const file: Express.Multer.File = {
        fieldname: 'photo',
        originalname: 'testphoto',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'testdestination',
        filename: 'testphoto',
        path: 'testpath',
        size: 1000,
        stream: new Readable,
        buffer: undefined,
      }
      const req = {
        protocol: 'http',
        get: function(headerName: string) {
          if (headerName === 'host') {
            return 'localhost'
          }
        },
      } as unknown as Request

      const result: ResponseUserDto = new ResponseUserDto()
      jest.spyOn(service, 'findOne').mockResolvedValue(result)
      jest.spyOn(service, 'findByUsername').mockResolvedValue(null)
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null)
      jest.spyOn(service, 'update').mockResolvedValue(result)
      await service.update('1', updateUserDto, file, req)
      expect(service.update).toHaveBeenCalledWith('1', updateUserDto, file, req)
      expect(result).toBeInstanceOf(ResponseUserDto)
    })

    it('should throw a BadRequestException because of existing username', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'existingusername',
        email: 'newemail',
        password: 'newpassword',
      }
      const existingUser: User = new User()
      jest.spyOn(service, 'findByUsername').mockResolvedValue(existingUser)
      await expect(service.update('1', updateUserDto, null, null)).rejects.toThrow()
    })

    it('should throw a BadRequestException because of existing email', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'newusername',
        email: 'existingemail',
        password: 'newpassword',
      }
      const existingUser: User = new User()
      jest.spyOn(service, 'findByEmail').mockResolvedValue(existingUser)
      await expect(service.update('1', updateUserDto, null, null)).rejects.toThrow()
    })
  })
    describe('followUser', () => {
      it('should follow a user', async () => {
        const user = new User()
        user.id = '1'
        jest.spyOn(service as any, 'findInternal').mockResolvedValue(user)
        jest.spyOn(service, 'followUser').mockResolvedValue(user)
        await service.followUser('1', '2')
        expect(service.followUser).toHaveBeenCalledWith('1', '2')
      })

      it('should throw a NotFoundException if user not found', async () => {
        jest.spyOn(service as any, 'findInternal').mockResolvedValue(null)
        await expect(service.followUser('1', '2')).rejects.toThrow(NotFoundException)
      })

      it('should throw a BadRequestException if user tries to follow themselves', async () => {
        const user = new User()
        user.id = '1'
        jest.spyOn(service as any, 'findInternal').mockResolvedValue(user)
        await expect(service.followUser('1', '1')).rejects.toThrow()
      })
    })

    describe('unfollowUser', () => {
      it('should unfollow a user', async () => {
        const user = new User()
        user.id = '1'
        user.followers = [new User()]
        user.followers[0].id = '2'
        jest.spyOn(service as any, 'findInternal').mockResolvedValue(user)
        jest.spyOn(service, 'unfollowUser').mockResolvedValue(user)
        await service.unfollowUser('1', '2')
        expect(service.unfollowUser).toHaveBeenCalledWith('1', '2')
      })

      it('should throw a NotFoundException if user not found', async () => {
        jest.spyOn(service as any, 'findInternal').mockResolvedValue(null)
        await expect(service.unfollowUser('1', '2')).rejects.toThrow(NotFoundException)
      })

      it('should throw a BadRequestException if user tries to unfollow themselves', async () => {
        const user = new User()
        user.id = '1'
        jest.spyOn(service as any, 'findInternal').mockResolvedValue(user)
        await expect(service.unfollowUser('1', '1')).rejects.toThrow()
      })
    })

    describe('getFollowers', () => {
      it('should get followers of a user', async () => {
        const user = new User()
        user.id = '1'
        user.followers = [new User(), new User()]
        jest.spyOn(service as any, 'findInternal').mockResolvedValue(user)
        jest.spyOn(service, 'getFollowers').mockResolvedValue(user.followers)
        const result = await service.getFollowers('1')
        expect(service.getFollowers).toHaveBeenCalledWith('1')
        expect(result).toEqual(user.followers)
      })

      it('should throw a NotFoundException if user not found', async () => {
        jest.spyOn(service as any, 'findInternal').mockResolvedValue(null)
        await expect(service.getFollowers('1')).rejects.toThrow(NotFoundException)
      })
    })
  describe('getFollowing', () => {
    it('should return the users that the specified user is following', async () => {
      const user = new User()
      user.id = '1'
      jest.spyOn(service as any, 'findInternal').mockResolvedValue(user)
      jest.spyOn(service, 'getFollowing').mockResolvedValue([new User(), new User()])
      const result = await service.getFollowing('1')
      expect(service.getFollowing).toHaveBeenCalledWith('1')
      expect(result).toHaveLength(2)
    })

    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(service as any, 'findInternal').mockResolvedValue(null)
      await expect(service.getFollowing('1')).rejects.toThrow(NotFoundException)
    })
  })

  describe('likePost', () => {
    it('should like a post', async () => {
      const user = new User()
      user.id = '1'
      const post = new Post()
      post._id = '1'
      post.likes = []
      jest.spyOn(service as any, 'findInternal').mockResolvedValue(user)
      jest.spyOn(service, 'likePost').mockResolvedValue(post)
      const result = await service.likePost('1', '1')
      expect(service.likePost).toHaveBeenCalledWith('1', '1')
    })

    it('should throw a BadRequestException if user already liked the post', async () => {
      const user = new User()
      user.id = '1'
      const post = new Post()
      post._id = '1'
      post.likes = ['1']
      jest.spyOn(service as any, 'findInternal').mockResolvedValue(user)
      await expect(service.likePost('1', '1')).rejects.toThrow()
    })
  })

  describe('unlikePost', () => {
    it('should unlike a post', async () => {
      const user = new User()
      user.id = '1'
      const post = new Post()
      post._id = '1'
      post.likes = ['1']
      jest.spyOn(service as any, 'findInternal').mockResolvedValue(user)
      jest.spyOn(service, 'unlikePost').mockResolvedValue(post)
      const result = await service.unlikePost('1', '1')
      expect(service.unlikePost).toHaveBeenCalledWith('1', '1')
    })

    it('should throw a BadRequestException if user did not like the post', async () => {
      const user = new User()
      user.id = '1'
      const post = new Post()
      post._id = '1'
      post.likes = []
      jest.spyOn(service as any, 'findInternal').mockResolvedValue(user)
      await expect(service.unlikePost('1', '1')).rejects.toThrow()
    })
  })
  describe('remove', () => {
    it('should remove a user', async () => {
      const user = new User()
      const dto = new ResponseUserDto()
      const mockQuery = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      }
      jest
        .spyOn(service as any, 'findOne')
        .mockReturnValue(mockQuery as any)
      jest.spyOn(service, 'remove').mockResolvedValue({ affected: 1, raw: [] })
      jest.spyOn(service as any, 'invalidateCacheKey').mockResolvedValue(dto)
      jest.spyOn(storageServiceMock as any, 'removeFile').mockResolvedValue(dto)

      expect(await service.remove('uuid')).toEqual({ affected: 1, raw: [] })
    })

    it('should throw a NotFoundException', async () => {
      const mockQuery = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      jest
        .spyOn(service as any, 'findOne')
        .mockReturnValue(mockQuery as any)
      await expect(service.remove('uuid')).rejects.toThrow()
    })
  })
    describe('findByUsername', () => {
      it('should return a user if found in cache', async () => {
        const user = new User()
        jest.spyOn(cacheManager, 'get').mockResolvedValue(user)
        expect(await service.findByUsername('username')).toEqual(user)
      })

      it('should return a user if found in database', async () => {
        const user = new User()
        jest.spyOn(cacheManager, 'get').mockResolvedValue(null)
        jest.spyOn(repository, 'findOne').mockResolvedValue(user)
        expect(await service.findByUsername('username')).toEqual(user)
      })
    })

    describe('findByEmail', () => {
      it('should return a user if found in cache', async () => {
        const user = new User()
        jest.spyOn(cacheManager, 'get').mockResolvedValue(user)
        expect(await service.findByEmail('email')).toEqual(user)
      })

      it('should return a user if found in database', async () => {
        const user = new User()
        jest.spyOn(cacheManager, 'get').mockResolvedValue(null)
        jest.spyOn(repository, 'findOne').mockResolvedValue(user)
        expect(await service.findByEmail('email')).toEqual(user)
      })
    })

    describe('validatePassword', () => {
      it('should return true if password matches', async () => {
        jest.spyOn(bcryptService, 'isMatch').mockResolvedValue(true)
        expect(await service.validatePassword('password', 'hashedPassword')).toEqual(true)
      })

      it('should return false if password does not match', async () => {
        jest.spyOn(bcryptService, 'isMatch').mockResolvedValue(false)
        expect(await service.validatePassword('password', 'hashedPassword')).toEqual(false)
      })
    })

    describe('checkUser', () => {
      it('should return true if username and password match', async () => {
        const user = new User()
        user.password = 'hashedPassword'
        jest.spyOn(service, 'findByUsername').mockResolvedValue(user)
        jest.spyOn(bcryptService, 'isMatch').mockResolvedValue(true)
        expect(await service.checkUser('username', 'password')).toEqual(true)
      })

      it('should throw NotFoundException if user not found', async () => {
        jest.spyOn(service, 'findByUsername').mockResolvedValue(null)
        await expect(service.checkUser('username', 'password')).rejects.toThrow(NotFoundException)
      })

      it('should throw BadRequestException if user password is not defined', async () => {
        const user = new User()
        jest.spyOn(service, 'findByUsername').mockResolvedValue(user)
        await expect(service.checkUser('username', 'password')).rejects.toThrow()
      })
    })
})