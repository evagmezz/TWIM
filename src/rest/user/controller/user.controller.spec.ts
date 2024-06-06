import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from '../services/user.service'
import { CacheModule } from '@nestjs/cache-manager'
import { ResponseUserDto } from '../dto/response-user.dto'
import { Paginated } from 'nestjs-paginate'
import { NotFoundException } from '@nestjs/common'
import { Readable } from 'stream'
import { mock } from 'jest-mock-extended'
import { Request } from 'express'
import { UpdateUserDto } from '../dto/update-user.dto'
import { CreateUserDto } from '../dto/create-user.dto'
import { Role } from '../entities/user.entity'

describe('UserController', () => {
  let controller: UserController
  let service: UserService

  const userServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    followUser: jest.fn(),
    unfollowUser: jest.fn(),
    getFollowers: jest.fn(),
    getFollowing: jest.fn(),
    likePost: jest.fn(),
    unlikePost: jest.fn(),
    checkUser: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile()

    controller = module.get<UserController>(UserController)
    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
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
      jest.spyOn(service, 'findAll').mockResolvedValue(page)
      const result: any = await controller.findAll(paginateOptions)
      expect(result.meta.totalPages).toEqual(0)
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a user', async () => {
      const id = 'uuid'
      const result: ResponseUserDto = new ResponseUserDto()
      jest.spyOn(service, 'findOne').mockResolvedValue(result)
      await controller.findOne(id)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(result).toBeInstanceOf(ResponseUserDto)
    })
    it('should throw a NotFoundException', async () => {
      const id = 'uuid'
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
    })
  })
  describe('getProfile', () => {
    it('should return a user', async () => {
      const id = 'uuid'
      const result: ResponseUserDto = new ResponseUserDto()
      jest.spyOn(service, 'findOne').mockResolvedValue(result)
      await controller.getProfile(id)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(result).toBeInstanceOf(ResponseUserDto)
    })
    it('should throw a NotFoundException', async () => {
      const id = 'uuid'
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.getProfile(id)).rejects.toThrow(NotFoundException)
    })
  })
  describe('deleteProfile', () => {
    it('should return void', async () => {
      const request = {
        user: {
          id: 'uuid',
        },
      }
      jest.spyOn(service, 'remove').mockResolvedValue(undefined)
      await controller.deleteProfile(request)
      expect(service.remove).toHaveBeenCalledWith(request.user.id)
    })
  })
  describe('updateProfile', () => {
    it('should return a user', async () => {
      const request = {
        user: {
          id: 'uuid',
        },
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
          buffer: undefined,
        },
      ]
      const req = mock<Request>()
      const dto: UpdateUserDto = {
        username: 'username',
        email: 'email',
      }

      const result: ResponseUserDto = new ResponseUserDto()
      jest.spyOn(service, 'update').mockResolvedValue(result)
      await controller.updateProfile(request, dto, files[0], req)
      expect(service.update).toHaveBeenCalledWith(request.user.id, dto, files[0], req)
      expect(result).toBeInstanceOf(ResponseUserDto)
    })
  })
  describe('findFollowers', () => {
    it('should return an array of followers', async () => {
      const id = 'uuid'
      const followersDto: ResponseUserDto[] = [
        {
          id: '1',
          username: 'user1',
          name: 'name1',
          lastname: 'lastname1',
          email: 'email1',
          image: 'image1',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
          followers: [],
        },
      ]
      jest.spyOn(service, 'getFollowers').mockResolvedValue(followersDto)
      const result = await controller.findFollowers(id)
      expect(result).toEqual(followersDto)
      expect(service.getFollowers).toHaveBeenCalledWith(id)
    })
  })
  describe('findFollowing', () => {
    it('should return an array of following', async () => {
      const id = 'uuid'
      const followingDto: ResponseUserDto[] = [
        {
          id: '1',
          username: 'user1',
          name: 'name1',
          lastname: 'lastname1',
          email: 'email1',
          image: 'image1',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
          followers: [],
        },
      ]
      jest.spyOn(service, 'getFollowing').mockResolvedValue(followingDto)
      const result = await controller.findFollowing(id)
      expect(result).toEqual(followingDto)
      expect(service.getFollowing).toHaveBeenCalledWith(id)
    })
  })
  describe('create', () => {
    it('should return a user', async () => {
      const dto: CreateUserDto = {
        name: 'name',
        lastname: 'lastname',
        username: 'username',
        password: 'password',
        email: 'email',
        image: 'image',
        role: Role.USER,
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
          buffer: undefined,
        },
      ]
      const req = mock<Request>()

      const result: ResponseUserDto = new ResponseUserDto()
      jest.spyOn(service, 'create').mockResolvedValue(result)
      await controller.create(dto, files[0], req)
      expect(service.create).toHaveBeenCalledWith(dto, files[0], req)
      expect(result).toBeInstanceOf(ResponseUserDto)
    })
  })
  describe('update', () => {
    it('should return a user', async () => {
      const id = 'uuid'
      const dto: UpdateUserDto = {
        username: 'username',
        email: 'email',
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
          buffer: undefined,
        },
      ]
      const req = mock<Request>()

      const result: ResponseUserDto = new ResponseUserDto()
      jest.spyOn(service, 'update').mockResolvedValue(result)
      await controller.update(id, dto, files[0], req)
      expect(service.update).toHaveBeenCalledWith(id, dto, files[0], req)
      expect(result).toBeInstanceOf(ResponseUserDto)
    })
  })
  describe('followUser', () => {
    it('should return void', async () => {
     const followerId = 'followerId'
      const followingId = 'followingId'
      jest.spyOn(service, 'followUser').mockResolvedValue(undefined)
      await controller.followUser(followerId, followingId)
      expect(service.followUser).toHaveBeenCalledWith(followerId, followingId)
    })
  })
  describe('unfollowUser', () => {
    it('should return void', async () => {
     const followerId = 'followerId'
      const followingId = 'followingId'
      jest.spyOn(service, 'unfollowUser').mockResolvedValue(undefined)
      await controller.unfollowUser(followerId, followingId)
      expect(service.unfollowUser).toHaveBeenCalledWith(followerId, followingId)
    })
  })
  describe('likePost', () => {
    it('should return void', async () => {
     const userId = 'userId'
      const postId = 'postId'
      jest.spyOn(service, 'likePost').mockResolvedValue(undefined)
      await controller.likePost(userId, postId)
      expect(service.likePost).toHaveBeenCalledWith(userId, postId)
    })
  })
  describe('unlikePost', () => {
    it('should return void', async () => {
     const userId = 'userId'
      const postId = 'postId'
      jest.spyOn(service, 'unlikePost').mockResolvedValue(undefined)
      await controller.unlikePost(userId, postId)
      expect(service.unlikePost).toHaveBeenCalledWith(userId, postId)
    })
  })
  describe('remove', () => {
    it('should return void', async () => {
      const id = 'uuid'
      jest.spyOn(service, 'remove').mockResolvedValue(undefined)
      await controller.remove(id)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
  describe('checkUser', () => {
    it('should return a user if the username and password match', async () => {
      const username = 'testUsername'
      const password = 'testPassword'
      const result: boolean = true

      jest.spyOn(service, 'checkUser').mockResolvedValue(result)

      const response = await controller.checkUser(username, password)

      expect(service.checkUser).toHaveBeenCalledWith(username, password)
      expect(response).toEqual(result)
    })
  })
})
