import { CreateUserDto } from '../../user/dto/create-user.dto'
import { UserSignUpDto } from '../dto/ user-sign.up.dto'
import { Injectable } from '@nestjs/common'
import { Role } from '../../user/entities/user.entity'

@Injectable()
export class AuthMapper {
  toCreateDto(userSignUpDto: UserSignUpDto): CreateUserDto {
    const userCreateDto = new CreateUserDto()
    userCreateDto.name = userSignUpDto.name
    userCreateDto.lastname = userSignUpDto.lastname
    userCreateDto.username = userSignUpDto.username
    userCreateDto.password = userSignUpDto.password
    userCreateDto.email = userSignUpDto.email
    userCreateDto.image = userSignUpDto.image
    userCreateDto.role = [Role.USER]
    return userCreateDto
  }
}
