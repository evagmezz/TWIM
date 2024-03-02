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
  Put,
  Query,
} from '@nestjs/common'
import { CommentService } from '../services/comment.service'
import { CreateCommentDto } from '../dto/create-comment.dto'
import { UpdateCommentDto } from '../dto/update-comment.dto'

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
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
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto)
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, updateCommentDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentService.remove(id)
  }
}
