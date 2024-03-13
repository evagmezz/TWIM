import { IsNotEmpty, Length, Matches } from 'class-validator'
import { Transform } from 'class-transformer'

export class UserSignInDto {
  @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
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
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string
}
