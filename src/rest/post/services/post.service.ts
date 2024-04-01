import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreatePostDto } from '../dto/create-post.dto'
import { UpdatePostDto } from '../dto/update-post.dto'
import { InjectModel } from '@nestjs/mongoose'
import { PaginateModel } from 'mongoose'
import { Post, PostDocument } from '../entities/post.entity'
import { PostMapper } from '../mapper/post-mapper'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Comment, CommentDocument } from '../../comment/entities/comment.entity'
import { StorageService } from '../../storage/services/ storage.service'
import { Request } from 'express'
import { User } from '../../user/entities/user.entity'
import { UserMapper } from '../../user/mapper/user-mapper'
import { CommentMapper } from '../../comment/mapper/comment-mapper'

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name)

  constructor(
    @InjectModel(Post.name)
    private postRepository: PaginateModel<PostDocument>,
    private readonly postMapper: PostMapper,
    private readonly storageService: StorageService,
    @InjectModel(Comment.name)
    private commentRepository: PaginateModel<CommentDocument>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapper,
    private readonly commentMapper: CommentMapper,
  ) {
  }

  async findAll(page: number, limit: number, orderBy: string, order: string) {
    this.logger.log('Buscando todos los posts')
    const options = {
      page,
      limit,
      sort: {
        [orderBy]: order,
      },
    }
    const result = await this.postRepository.paginate({}, options)
    const docs = await Promise.all(result.docs.map(async (post) => {
      const user = await this.getUserByUserId(post.userId)
      return this.postMapper.toDto(post, user)
    }))

    return {
      ...result,
      docs,
    }
  }

  async getUserByUserId(userId: string) {
    this.logger.log(`Buscando usuario con userId ${userId}`)
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) {
      throw new NotFoundException(`El usuario con el id ${userId} no existe`)
    }
    return this.userMapper.toDto(user)
  }

  async findOne(id: string) {
    this.logger.log(`Buscando post con id ${id}`)
    const post = await this.postRepository.findById(id).exec()
    const user = await this.userRepository.findOneBy({ id: post.userId })
    if (!post) {
      throw new NotFoundException(`El post con el id ${id} no existe`)
    }
    return this.postMapper.toDto(post, user)
  }

  async findByUserId(userId: string) {
    this.logger.log(`Searching order with userId: ${userId}`);
    return await this.postRepository.find({ userId }).exec();
  }

  async getAllComments(id: string) {
    this.logger.log(`Buscando comentarios del post con id ${id}`)
    const post = await this.findOne(id)
    if (!post) {
      throw new NotFoundException(`El post con el id ${id} no existe`)
    }
    const comments = await this.commentRepository.find({ postId: id }).exec()
    const dtos = await Promise.all(comments.map(async (comment) => {
      const user = await this.getUserByUserId(comment.userId)
      return this.commentMapper.toDto(comment, user)
    }))
    return dtos
  }

  async create(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
    req: Request,
  ) {
    this.logger.log('Creando post')

    if (!files || files.length === 0) {
      throw new BadRequestException('Debe subir al menos una imagen')
    }

    createPostDto.photos = files.map(
      (file) => `${req.protocol}://${req.get('host')}/photos/${file.filename}`,
    )
    const post = this.postMapper.toEntity(createPostDto)
    const created = await this.postRepository.create(post)
    const user = await this.userRepository.findOneBy({ id: created.userId })
    return this.postMapper.toDto(created, user)
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    this.logger.log(`Actualizando post con id ${id}`)
    const post = await this.postRepository.findById(id).exec()
    if (!post) {
      throw new NotFoundException(`El post con el id ${id} no existe`)
    }
    post.title = updatePostDto.title;
    const updated = await post.save();
    const user = await this.userRepository.findOneBy({ id: updated.userId })
    return this.postMapper.toDto(updated, user)
  }

  async remove(id: string) {
    this.logger.log(`Eliminando post con id ${id}`)
    const post = await this.findOne(id)
    if (!post) {
      throw new NotFoundException(`El post con el id ${id} no existe`)
    }
    this.storageService.removeFiles(post.photos)
    return await this.postRepository.findByIdAndDelete(id).exec()
  }

  async findPostsLikedByUser(userId: string) {
    this.logger.log(`Buscando posts que el usuario con id ${userId} ha dado like`)
    const allPosts = await this.postRepository.find().exec()
    const likedPosts = allPosts.filter(post => post.likes.includes(userId))
    const dtos = await Promise.all(likedPosts.map(async (post) => {
      const user = await this.getUserByUserId(post.userId)
      return this.postMapper.toDto(post, user)
    }))
    return dtos
  }

  async userExists(userId: string) {
    this.logger.log(`Comprobando si el usuario con id ${userId} existe`)
    const user = await this.userRepository.findOneBy({ id: userId })
    return !!user
  }

  async getUserByUsername(username: string) {
    this.logger.log(`Buscando usuario con username ${username}`)
    const user = await this.userRepository.findOneBy({ username })
    return this.userMapper.toDto(user)
  }
}
