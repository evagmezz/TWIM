import { Injectable } from '@nestjs/common'
import { CreateCommentDto } from '../dto/create-comment.dto'
import { plainToClass } from 'class-transformer'
import { Comment } from '../entities/comment.entity'
import { ResponseUserDto } from '../../user/dto/response-user.dto';
import { ResponseCommentDto } from '../dto/response-comment.dto';

@Injectable()
export class CommentMapper {
  toEntity(createCommentDto: CreateCommentDto): Comment {
    return plainToClass(Comment, createCommentDto)
  }

  toDto(comment: Comment  ,  userDto: ResponseUserDto): ResponseCommentDto {
    return {
      id: comment._id,
      postId: comment.postId,
      userId: comment.userId,
      content: comment.content,
      user: userDto,
      createdAt: comment.createdAt,
    }
  }
}
