import { Injectable } from '@nestjs/common'
import { CreateCommentDto } from '../dto/create-comment.dto'
import { plainToClass } from 'class-transformer'
import { Comment } from '../entities/comment.entity'

@Injectable()
export class CommentMapper {
  toEntity(createCommentDto: CreateCommentDto): Comment {
    return plainToClass(Comment, createCommentDto)
  }
}
