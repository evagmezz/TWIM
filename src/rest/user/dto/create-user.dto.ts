import { ArrayNotEmpty, IsArray, Length, Matches } from 'class-validator'
import { Transform } from 'class-transformer'
import { Role } from '../entities/user.entity'

export class CreateUserDto {
  @Length(2, 20, {
    message: 'El nombre debe tener entre 2 y 20 caracteres',
  })
  @Transform(({ value }) => value.trim())
  name: string

  @Length(2, 20, {
    message: 'El apellido debe tener entre 2 y 20 caracteres',
  })
  @Transform(({ value }) => value.trim())
  lastname: string

  @Length(2, 20, {
    message: 'El nombre de usuario debe tener entre 2 y 20 caracteres',
  })
  @Matches(/^[a-zA-Z0-9_]*$/, {
    message:
      'El nombre de usuario solo puede contener letras, números y guiones bajos',
  })
  @Transform(({ value }) => value.trim())
  username: string

  @Length(8, 20, {
    message: 'La contraseña debe tener entre 8 y 20 caracteres',
  })
  @Transform(({ value }) => value.trim())
  password: string

  @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
    message: 'El email no es válido',
  })
  @Transform(({ value }) => value.trim())
  email: string

  @IsArray()
  @ArrayNotEmpty()
  role: string[]
}
