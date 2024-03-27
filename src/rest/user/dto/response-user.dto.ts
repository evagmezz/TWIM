import { IsString, Length, Matches } from 'class-validator'

export class ResponseUserDto {
  id: string

  @Length(2, 20, {
    message: 'El nombre debe tener entre 2 y 20 caracteres',
  })
  name: string

  @Length(2, 20, {
    message: 'El apellido debe tener entre 2 y 20 caracteres',
  })
  lastname: string

  @Length(2, 20, {
    message: 'El nombre de usuario debe tener entre 2 y 20 caracteres',
  })
  username: string

  @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, {
    message: 'El email no es válido',
  })
  email: string

  @IsString()
  image: string
  role: string
  createdAt: Date
  updatedAt: Date
  followers: ResponseUserDto[]
}
