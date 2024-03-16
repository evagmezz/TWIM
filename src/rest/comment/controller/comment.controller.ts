import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CommentService } from '../services/comment.service'
import { CreateCommentDto } from '../dto/create-comment.dto'
import { Roles, RolesAuthGuard } from '../../auth/ guards/roles-auth.guard'
import { JwtAuthGuard } from '../../auth/ guards/ jwt-auth.guard'

@Controller('comment')
@UseGuards(JwtAuthGuard, RolesAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @Roles('USER')
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number = 1,
    @Query('limit', new DefaultValuePipe(10)) limit: number = 10,
    @Query('orderBy', new DefaultValuePipe('createdAt'))
    orderBy: string,
    @Query('order', new DefaultValuePipe('asc'))
    order: string,
  ) {
    return await this.commentService.findAll(page, limit, orderBy, order)
  }

  @Get(':id')
  @Roles('USER')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentService.findOne(id)
  }

  @Get('post/:postId')
  @Roles('USER')
  async findByPostId(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.commentService.findByPostId(postId)
  }

  @Post()
  @HttpCode(201)
  @Roles('USER')
  async create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto)
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('USER')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentService.remove(id)
  }
}
