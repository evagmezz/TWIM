import { Injectable } from '@nestjs/common'
import { ResponseUserDto } from '../dto/response-user.dto'
import { User } from '../entities/user.entity'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { plainToClass } from 'class-transformer'

@Injectable()
export class UserMapper {
  toDto(user: User): ResponseUserDto {
    const { password, ...userDto } = user
    const response = plainToClass(ResponseUserDto, userDto)
    response.followers = user.followers?.map((follower) => this.toDto(follower))
    return response
  }

  toEntity(userDto: CreateUserDto | UpdateUserDto): User {
    const user = new User()
    return { ...userDto, ...user }
  }

  toUser(responseUserDto: ResponseUserDto): User {
    const user = new User()
    return { ...responseUserDto, ...user }
  }
}
