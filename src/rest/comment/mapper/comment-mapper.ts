import { Injectable } from '@nestjs/common'
import { CreateCommentDto } from '../dto/create-comment.dto'
import { plainToClass } from 'class-transformer'
import { Comment } from '../entities/comment.entity'
import { UpdateCommentDto } from '../dto/update-comment.dto'

@Injectable()
export class CommentMapper {
  toEntity(createCommentDto: CreateCommentDto | UpdateCommentDto): Comment {
    return plainToClass(Comment, createCommentDto)
  }
}
