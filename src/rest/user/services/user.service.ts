import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { UserMapper } from '../mapper/user-mapper'
import { BcryptService } from './bcrypt.service'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapper,
    private readonly bcryptService: BcryptService,
  ) {}

  async findAll() {
    this.logger.log('Buscando todos los usuarios')
    return (await this.userRepository.find()).map((users) =>
      this.userMapper.toDto(users),
    )
  }

  async findOne(id: string) {
    this.logger.log(`Buscando usuario con id ${id}`)
    const user = await this.findInternal(id)
    return this.userMapper.toDto(user)
  }

  async create(createUserDto: CreateUserDto) {
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
    const hashPassword = await this.bcryptService.hash(createUserDto.password)
    const newUser = this.userMapper.toEntity(createUserDto)
    newUser.password = hashPassword
    const userCreated = await this.userRepository.save(newUser)
    return this.userMapper.toDto(userCreated)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Actualizando usuario con id ${id}`)
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    }
    const userByUsername = await this.findByUsername(updateUserDto.username)
    if (userByUsername && userByUsername.id !== id) {
      throw new BadRequestException(
        `El nombre de usuario ${updateUserDto.username} ya existe`,
      )
    }
    const userByEmail = await this.findByEmail(updateUserDto.email)
    if (userByEmail && userByEmail.id !== id) {
      throw new BadRequestException(`El email ${updateUserDto.email} ya existe`)
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.bcryptService.hash(
        updateUserDto.password,
      )
    }
    const updatedUser = this.userMapper.toEntity(updateUserDto)
    updatedUser.id = id
    const userUpdated = await this.userRepository.save({
      ...user,
      ...updatedUser,
    })
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
    return this.userMapper.toDto(user)
  }

  async getFollowers(userId: string) {
    this.logger.log(`Obteniendo seguidores del usuario con id ${userId}`)
    const user = await this.findInternal(userId)
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`)
    }

    return user.followers.map((u) => this.userMapper.toDto(u))
  }

  async getFollowing(userId: string) {
    this.logger.log(`Obteniendo seguidos del usuario con id ${userId}`)
    const user = await this.findInternal(userId)
    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`)
    }
    const following = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.followers', 'followers')
      .where('followers.id = :id', { id: userId })
      .getMany()
    return following.map((u) => this.userMapper.toDto(u))
  }

  async remove(id: string) {
    this.logger.log(`Eliminando usuario con id ${id}`)
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    } else {
      return await this.userRepository.delete(id)
    }
  }

  private async findByUsername(username: string) {
    this.logger.log(`Buscando usuario con username ${username}`)
    return await this.userRepository.findOne({ where: { username } })
  }

  private async findByEmail(email: string) {
    this.logger.log(`Buscando usuario con email ${email}`)
    return await this.userRepository.findOne({ where: { email } })
  }

  private async findInternal(id: string) {
    this.logger.log(`Buscando usuario con id ${id}`)
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['followers'],
    })
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    }
    return user
  }
}
