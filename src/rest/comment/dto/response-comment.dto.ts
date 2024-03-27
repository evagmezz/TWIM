import { ResponseUserDto } from '../../user/dto/response-user.dto';

export class ResponseCommentDto {
  id: string
  userId: string
  postId: string
  content: string
  user: ResponseUserDto
  createdAt: Date
}