import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { UserMapper } from '../mapper/user-mapper'
import { BcryptService } from './bcrypt.service'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ResponseUserDto } from '../dto/response-user.dto'
import { paginate, PaginateQuery } from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'
import { Request } from 'express'
import { StorageService } from '../../storage/services/ storage.service'
import { Post, PostDocument } from '../../post/entities/post.entity'
import { InjectModel } from '@nestjs/mongoose'
import { PaginateModel } from 'mongoose'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapper,
    private readonly storageService: StorageService,
    private readonly bcryptService: BcryptService,
    @InjectModel(Post.name)
    private postRepository: PaginateModel<PostDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
  }

  async findAll(query: PaginateQuery) {
    this.logger.log('Buscando todos los usuarios')
    const cache: ResponseUserDto[] = await this.cacheManager.get(
      `all_users_page_${hash(JSON.stringify(query))}`,
    )
    if (cache) {
      this.logger.log('Encontrado en cache')
      return cache
    }
    const page = await paginate(query, this.userRepository, {
      sortableColumns: ['id', 'username', 'email'],
      searchableColumns: ['username', 'email'],
    })
    const res = {
      data: (page.data ?? []).map((user) =>
        this.userMapper.toDto(user),
      ),
      meta: page.meta,
      links: page.links,
    }
    await this.cacheManager.set(
      `all_users_page_${hash(JSON.stringify(query))}`,
      res,
      60,
    )
    return res
  }

  async findOne(id: string) {
    this.logger.log(`Buscando usuario con id ${id}`)
    const cache: ResponseUserDto = await this.cacheManager.get(`user_${id}`)
    if (cache) {
      this.logger.log('Encontrado en cache')
      return cache
    }
    const user = await this.findInternal(id)
    await this.cacheManager.set(`user_${id}`, user, 60)
    return this.userMapper.toDto(user)
  }

  async create(
    createUserDto: CreateUserDto,
    file: Express.Multer.File,
    req: Request,
  ) {
    this.logger.log('Creando usuario')
    const user = await Promise.all([
      this.findByUsername(createUserDto.username),
      this.findByEmail(createUserDto.email),
    ])
    if (user[0]) {
      throw new BadRequestException(
        `El nombre de usuario ${createUserDto.username} ya existe`,
      )
    }
    if (user[1]) {
      throw new BadRequestException(`El email ${createUserDto.email} ya existe`)
    }
    if (file) {
      createUserDto.image = `${req.protocol}://${req.get('host')}/photos/${file.filename}`
    } else {
      createUserDto.image = User.IMAGE_DEFAULT
    }
    const hashPassword = await this.bcryptService.hash(createUserDto.password)
    const newUser = this.userMapper.toEntity(createUserDto)
    newUser.password = hashPassword
    const userCreated = await this.userRepository.save(newUser)
    await this.invalidateCacheKey('all_users')
    return this.userMapper.toDto(userCreated)
  }

  async update(id: string, updateUserDto: UpdateUserDto, file: Express.Multer.File, req: Request) {
    this.logger.log(`Actualizando usuario con id ${id}`)
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    }
    if (updateUserDto.username) {
      const userByUsername = await this.findByUsername(updateUserDto.username)
      if (userByUsername && userByUsername.id !== id) {
        throw new BadRequestException(
          `El nombre de usuario ${updateUserDto.username} ya existe`,
        )
      }
    }
    if (updateUserDto.email) {
      const userByEmail = await this.findByEmail(updateUserDto.email)
      if (userByEmail && userByEmail.id !== id) {
        throw new BadRequestException(`El email ${updateUserDto.email} ya existe`)
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.bcryptService.hash(
        updateUserDto.password,
      )
    }
    if (file) {
      if (user.image !== User.IMAGE_DEFAULT) {
        this.storageService.removeFile(user.image)
      }
      updateUserDto.image = `${req.protocol}://${req.get('host')}/photos/${file.filename}`
    } else {
      if (user.image !== User.IMAGE_DEFAULT) {
        this.storageService.removeFile(user.image)
        updateUserDto.image = User.IMAGE_DEFAULT
      }
      updateUserDto.image = User.IMAGE_DEFAULT
    }
    const updatedUser = this.userMapper.toEntity(updateUserDto)
    updatedUser.id = id
    const userUpdated = await this.userRepository.save({
      ...user,
      ...updatedUser,
    })
    await this.invalidateCacheKey(`user_${id}`)
    await this.invalidateCacheKey('all_users')
    return this.userMapper.toDto(userUpdated)
  }

  async followUser(userId: string, userToFollowId: string) {
    this.logger.log(`Siguiendo a usuario con id ${userToFollowId}`)
    const user = await this.findInternal(userId)
    const userToFollow = await this.findInternal(userToFollowId)
    if (!user || !userToFollow) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`)
    }
    if (user.id === userToFollow.id) {
      throw new BadRequestException('No puedes seguirte a ti mismo')
    }
    if (userToFollow.followers.find((u) => u.id === user.id)) {
      throw new BadRequestException(
        `Ya sigues al usuario con id ${userToFollow.id}`,
      )
    }
    userToFollow.followers.push(user)

    await this.userRepository.save(userToFollow)
    await this.cacheManager.del(`user_${userToFollowId}`)
    await this.cacheManager.del(`followers_${userToFollowId}`)
    return this.userMapper.toDto(user)
  }

  async unfollowUser(userId: string, userToUnfollowId: string) {
    this.logger.log(`Dejando de seguir a usuario con id ${userToUnfollowId}`)
    const user = await this.findInternal(userId)
    const userToUnfollow = await this.findInternal(userToUnfollowId)
    if (!user || !userToUnfollow) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`)
    }
    if (user.id === userToUnfollow.id) {
      throw new BadRequestException('No puedes dejarte de seguir a ti mismo')
    }
    if (!userToUnfollow.followers.find((u) => u.id === user.id)) {
      throw new BadRequestException(
        `No sigues al usuario con id ${userToUnfollow.id}`,
      )
    }
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (u) => u.id !== user.id,
    )
    await this.userRepository.save(userToUnfollow)
    await this.cacheManager.del(`user_${userToUnfollowId}`)
    await this.cacheManager.del(`followers_${userToUnfollowId}`)
    return this.userMapper.toDto(user)
  }

  async getFollowers(userId: string) {
    this.logger.log(`Obteniendo seguidores del usuario con id ${userId}`)
    const cache: ResponseUserDto[] = await this.cacheManager.get(
      `followers_${userId}`,
    )
    if (cache) {
      this.logger.log('Encontrado en cache')
      return cache
    }
    const user = await this.findInternal(userId)
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`)
    }
    const followers = user.followers.map((u) => this.userMapper.toDto(u))
    await this.cacheManager.set(`followers_${userId}`, followers, 60)
    return followers
  }

  async getFollowing(userId: string) {
    this.logger.log(`Obteniendo seguidos del usuario con id ${userId}`)
    const cache: ResponseUserDto[] = await this.cacheManager.get(
      `following_${userId}`,
    )
    if (cache) {
      this.logger.log('Encontrado en cache')
      return cache
    }
    const user = await this.findInternal(userId)
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`)
    }
    const following = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.followers', 'followers')
      .where('followers.id = :id', { id: userId })
      .getMany()
    const followingDto = following.map((u) => this.userMapper.toDto(u))
    await this.cacheManager.set(`following_${userId}`, followingDto, 60)
    return followingDto
  }

  async likePost(userId: string, postId: string) {
    this.logger.log(`Dando like al post con id ${postId}`)
    const user = await this.findInternal(userId)
    const post: Post = await this.postRepository.findOne({ _id: postId })
    if (post.likes.includes(user.id)) {
      throw new BadRequestException('Ya le diste like a este post')
    }
    post.likes.push(user.id)
    await this.postRepository.updateOne({ _id: postId }, post)
    return post
  }

  async unlikePost(userId: string, postId: string) {
    this.logger.log(`Quitando like al post con id ${postId}`)
    const user = await this.findInternal(userId)
    const post: Post = await this.postRepository.findOne({ _id: postId })
    if (!post.likes.includes(user.id)) {
      throw new BadRequestException('No le diste like a este post')
    }
    post.likes = post.likes.filter((id) => id !== user.id)
    await this.postRepository.updateOne({ _id: postId }, post)
    return post
  }

  async remove(id: string) {
    this.logger.log(`Eliminando usuario con id ${id}`)
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    } else {
      await this.invalidateCacheKey(`user_${id}`)
      await this.invalidateCacheKey('all_users')
      if (user.image !== User.IMAGE_DEFAULT) {
        this.storageService.removeFile(user.image)
      }
      return await this.userRepository.delete(id)
    }
  }

  async findByUsername(username: string) {
    this.logger.log(`Buscando usuario con username ${username}`)
    const cache: User = await this.cacheManager.get(`user_username_${username}`)
    if (cache) {
      this.logger.log('Encontrado en cache')
      return cache
    }
    const user = await this.userRepository.findOne({ where: { username } })
    await this.cacheManager.set(`user_username_${username}`, user, 60)
    return user
  }

  async findByEmail(email: string) {
    this.logger.log(`Buscando usuario con email ${email}`)
    const cache: User = await this.cacheManager.get(`user_email_${email}`)
    if (cache) {
      this.logger.log('Encontrado en cache')
      return cache
    }
    const user = await this.userRepository.findOne({ where: { email } })
    await this.cacheManager.set(`user_email_${email}`, user, 60)
    return user
  }

  async validatePassword(password: string, hashPassword: string) {
    this.logger.log(`Validando contraseña`)
    return await this.bcryptService.isMatch(password, hashPassword)
  }

  async checkUser(username: string, password: string) {
    this.logger.log(`Validando usuario`)
    const user = await this.findByUsername(username)
    if (!user) {
      throw new NotFoundException(`Usuario ${username} no encontrado`)
    }
    if (!user.password) {
      throw new BadRequestException(`La contraseña del usuario ${username} no está definida`)
    }
    return await this.bcryptService.isMatch(password, user.password)
  }

  async invalidateCacheKey(keyPattern: string): Promise<void> {
    const cacheKeys = await this.cacheManager.store.keys()
    const keysToDelete = cacheKeys.filter((key) => key.startsWith(keyPattern))
    const promises = keysToDelete.map((key) => this.cacheManager.del(key))
    await Promise.all(promises)
  }

  private async findInternal(id: string) {
    this.logger.log(`Buscando usuario con id ${id}`)
    const cache: User = await this.cacheManager.get(`user_${id}`)
    if (cache) {
      this.logger.log('Encontrado en cache')
      return cache
    }
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['followers'],
    })
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    }
    await this.cacheManager.set(`user_${id}`, user, 60)
    return user
  }
}
