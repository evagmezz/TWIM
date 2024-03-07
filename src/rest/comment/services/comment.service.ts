import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateCommentDto } from '../dto/create-comment.dto'
import { UpdateCommentDto } from '../dto/update-comment.dto'
import { InjectModel } from '@nestjs/mongoose'
import { PaginateModel } from 'mongoose'
import { CommentMapper } from '../mapper/comment-mapper'
import { Comment, CommentDocument } from '../entities/comment.entity'

@Injectable()
export class CommentService {
  private logger = new Logger(CommentService.name)

  constructor(
    @InjectModel(Comment.name)
    private commentRepository: PaginateModel<CommentDocument>,
    private readonly commentMapper: CommentMapper,
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
    return await this.commentRepository.paginate({}, options)
  }

  async findOne(id: string) {
    this.logger.log(`Buscando comentario con id ${id}`)
    const comment = this.commentRepository.findById(id).exec()
    if (!comment) {
      throw new NotFoundException(`El comentario con el id ${id} no existe`)
    }
    return comment
  }

  async findByPostId(postId: string) {
    this.logger.log(`Buscando comentario con postId ${postId}`)
    return await this.commentRepository.find({ postId }).exec()
  }

  async create(createCommentDto: CreateCommentDto) {
    this.logger.log('Creando comentario')
    const comment = this.commentMapper.toEntity(createCommentDto)
    return await this.commentRepository.create(comment)
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    this.logger.log(`Actualizando comentario con id ${id}`)
    const comment = this.commentRepository.findById(id).exec()
    if (!comment) {
      throw new NotFoundException(`El comentario con el id ${id} no existe`)
    }
    const commentUpdated = this.commentMapper.toEntity(updateCommentDto)
    return await this.commentRepository
      .findByIdAndUpdate(id, commentUpdated, {
        new: true,
      })
      .exec()
  }

  async remove(id: string) {
    this.logger.log(`Eliminando comentario con id ${id}`)
    const comment = this.commentRepository.findById(id).exec()
    if (!comment) {
      throw new NotFoundException(`El comentario con el id ${id} no existe`)
    }
    return this.commentRepository.findByIdAndDelete(id).exec()
  }
}
