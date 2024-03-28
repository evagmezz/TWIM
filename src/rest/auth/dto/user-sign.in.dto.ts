import { IsNotEmpty, Length, Matches } from 'class-validator'
import { Transform } from 'class-transformer'

export class UserSignInDto {
  @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
  @Transform(({ value }) => value.trim())
  username: string

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string
}
