import {IsUUID, Length} from 'class-validator'
import {Transform} from 'class-transformer'

export class CreatePostDto {
    @IsUUID('4', {message: 'El id del usuario debe ser un UUID v4'})
    userId: string

    @Length(1, 200, {
        message: 'El título debe tener entre 1 y 200 caracteres',
    })
    @Transform(({value}) => value.trim())
    title: string

    @Transform(({value}) => value.trim())
    photos: string[] = []

    location: string
}
