import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateCommentDto } from '../dto/create-comment.dto'
import { InjectModel } from '@nestjs/mongoose'
import { PaginateModel } from 'mongoose'
import { CommentMapper } from '../mapper/comment-mapper'
import { Comment, CommentDocument } from '../entities/comment.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../../user/mapper/user-mapper';


@Injectable()
export class CommentService {
  private logger = new Logger(CommentService.name)

  constructor(
    @InjectModel(Comment.name)
    private commentRepository: PaginateModel<CommentDocument>,
    private readonly commentMapper: CommentMapper,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapper,
  ) {}

  async findAll(page: number, limit: number, orderBy: string, order: string) {
    this.logger.log('Buscando todos los comentarios')
    const options = {
      page,
      limit,
      sort: {
        [orderBy]: order,
      },
    }
    const result = await this.commentRepository.paginate({}, options);
    const docs = await Promise.all(result.docs.map(async (comment) => {
      const user = await this.getUserByUserId(comment.userId);
      return this.commentMapper.toDto(comment, user);
    }));

    return {
      ...result,
      docs,
    };
  }

  async getUserByUserId(userId: string) {
    this.logger.log(`Buscando usuario con userId ${userId}`);
    const user = await this.userRepository.findOneBy({ id: userId })
    return this.userMapper.toDto(user);
  }

  async findOne(id: string) {
    this.logger.log(`Buscando comentario con id ${id}`)
    const comment = await this.commentRepository.findById(id).exec()
    if (!comment) {
      throw new NotFoundException(`El comentario con el id ${id} no existe`)
    }
    const user = await this.getUserByUserId(comment.userId);
    return this.commentMapper.toDto(comment, user);
  }

  async findByPostId(postId: string) {
    this.logger.log(`Buscando comentario en publicación con id ${postId}`)
    return await this.commentRepository.find({ postId }).exec()
  }

  async create(createCommentDto: CreateCommentDto) {
    this.logger.log('Creando comentario')
    const comment = this.commentMapper.toEntity(createCommentDto)
    const user = await this.userRepository.findOneBy({ id: comment.userId })
    await this.commentRepository.create(comment)
    return this.commentMapper.toDto(comment, user)
  }

  async remove(id: string) {
    this.logger.log(`Eliminando comentario con id ${id}`)
    const comment = this.commentRepository.findById(id).exec()
    if (!comment) {
      throw new NotFoundException(`El comentario con el id ${id} no existe`)
    }
     await this.commentRepository.findByIdAndDelete(id).exec()
  }
}
