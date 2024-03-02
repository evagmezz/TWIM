import { IsString, Length } from 'class-validator'

export class ResponsePostDto {
  id: string
  userId: string
  @Length(2, 100, {
    message: 'El título debe tener entre 2 y 100 caracteres',
  })
  title: string
  @Length(2, 1000, {
    message: 'El texto debe tener entre 2 y 1000 caracteres',
  })
  text: string
  @IsString({ message: 'Las fotos deben ser un array de strings' })
  photos: string[]
  @IsString({ message: 'La ubicación debe ser un string' })
  location: string
  createdAt: Date
  updatedAt: Date
}
