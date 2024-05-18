import { Injectable } from '@nestjs/common'
import { CreatePostDto } from '../dto/create-post.dto'
import { UpdatePostDto } from '../dto/update-post.dto'
import { Post } from '../entities/post.entity'
import { plainToClass } from 'class-transformer'
import { ResponsePostDto } from '../dto/response-post.dto'
import { ResponseUserDto } from '../../user/dto/response-user.dto';

@Injectable()
export class PostMapper {
  toEntity(createPostDto: CreatePostDto | UpdatePostDto): Post {
    return plainToClass(Post, createPostDto)
  }

  toDto(post: Post, userDto: ResponseUserDto): ResponsePostDto {
    return {
      id: post._id,
      photos: post.photos,
      likes: post.likes,
      title: post.title,
      location: post.location,
      comments: post.comments,
      user: userDto,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }
  }
}
