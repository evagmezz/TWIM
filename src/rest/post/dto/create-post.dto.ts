import { IsString, Length } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreatePostDto {
  @Length(1, 100, {
    message: 'El título debe tener entre 1 y 100 caracteres',
  })
  @Transform(({ value }) => value.trim())
  title: string = ''
  @Length(1, 1000, {
    message: 'El texto debe tener entre 1 y 1000 caracteres',
  })
  @Transform(({ value }) => value.trim())
  text: string = ''

  @IsString({ message: 'Las fotos deben ser un array de strings' })
  @Transform(({ value }) => value.trim())
  photos: string[] = []

  @IsString({ message: 'La ubicación debe ser un string' })
  @Transform(({ value }) => value.trim())
  location: string = ''
}
