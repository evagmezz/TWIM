import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IsOptional } from 'class-validator'
import { Role } from '../entities/user.entity'

export class UpdateUserDto extends PartialType(CreateUserDto) {
}
