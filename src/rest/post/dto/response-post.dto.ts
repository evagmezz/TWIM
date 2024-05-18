import { Comment } from '../../comment/entities/comment.entity'
import { ResponseUserDto } from '../../user/dto/response-user.dto';

export class ResponsePostDto {
  id: string

  user: ResponseUserDto

  title: string

  photos: string[]

  location: string

  createdAt: Date

  updatedAt: Date

  comments: Comment[]

  likes: string[]
}
