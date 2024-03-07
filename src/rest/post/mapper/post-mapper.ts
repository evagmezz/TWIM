import { Injectable } from '@nestjs/common'
import { CreatePostDto } from '../dto/create-post.dto'
import { UpdatePostDto } from '../dto/update-post.dto'
import { Post } from '../entities/post.entity'
import { plainToClass } from 'class-transformer'

@Injectable()
export class PostMapper {
  toEntity(createPostDto: CreatePostDto | UpdatePostDto): Post {
    return plainToClass(Post, createPostDto)
  }
}
