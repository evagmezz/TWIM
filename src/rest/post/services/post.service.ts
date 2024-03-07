import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreatePostDto } from '../dto/create-post.dto'
import { UpdatePostDto } from '../dto/update-post.dto'
import { InjectModel } from '@nestjs/mongoose'
import { PaginateModel } from 'mongoose'
import { PostDocument } from '../entities/post.entity'
import { PostMapper } from '../mapper/post-mapper'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../user/entities/user.entity'
import { Repository } from 'typeorm'
import { Post } from '../entities/post.entity'
import { Multer } from 'multer'
import { Comment, CommentDocument } from '../../comment/entities/comment.entity'

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name)

  constructor(
    @InjectModel(Post.name)
    private postRepository: PaginateModel<PostDocument>,
    private readonly postMapper: PostMapper,
    @InjectModel(Comment.name)
    private commentRepository: PaginateModel<CommentDocument>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(page: number, limit: number, orderBy: string, order: string) {
    this.logger.log('Buscando todos los posts')
    const options = {
      page,
      limit,
      sort: {
        [orderBy]: order,
      },
    }
    return await this.postRepository.paginate({}, options)
  }

  async findOne(id: string) {
    this.logger.log(`Buscando post con id ${id}`)
    const post = this.postRepository.findById(id).exec()
    if (!post) {
      throw new NotFoundException(`El post con el id ${id} no existe`)
    }
    return post
  }

  async findByUserId(userId: string) {
    this.logger.log(`Searching order with userId: ${userId}`)
    return await this.postRepository.find({ userId }).exec()
  }

  async getAllComments(id: string) {
    this.logger.log(`Buscando comentarios del post con id ${id}`)
    const post = await this.findOne(id)
    const comments = await this.commentRepository
      .find({ postId: post.id })
      .exec()
    if (!post) {
      throw new NotFoundException(`El post con el id ${id} no existe`)
    }
    return comments
  }

  async create(createPostDto: CreatePostDto, files: Express.Multer.File[]) {
    this.logger.log('Creando post')
    createPostDto.photos = files.map((file) => file.path)
    const post = this.postMapper.toEntity(createPostDto)
    return await this.postRepository.create(post)
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    this.logger.log(`Actualizando post con id ${id}`)
    const post = this.postRepository.findById(id).exec()
    if (!post) {
      throw new NotFoundException(`El post con el id ${id} no existe`)
    }
    const postUpdated = this.postMapper.toEntity(updatePostDto)
    return await this.postRepository
      .findByIdAndUpdate(id, postUpdated, {
        new: true,
      })
      .exec()
  }

  async remove(id: string) {
    this.logger.log(`Eliminando post con id ${id}`)
    const post = this.postRepository.findById(id).exec()
    if (!post) {
      throw new NotFoundException(`El post con el id ${id} no existe`)
    }
    return await this.postRepository.findByIdAndDelete(id).exec()
  }

  async userExists(userId: string) {
    this.logger.log(`Comprobando si el usuario con id ${userId} existe`)
    const user = await this.userRepository.findOneBy({ id: userId })
    return !!user
  }
}