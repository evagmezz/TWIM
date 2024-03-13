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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { PostService } from '../services/post.service'
import { CreatePostDto } from '../dto/create-post.dto'
import { UpdatePostDto } from '../dto/update-post.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Roles, RolesAuthGuard } from '../../auth/ guards/roles-auth.guard'
import { JwtAuthGuard } from '../../auth/ guards/ jwt-auth.guard'

@Controller('post')
@UseGuards(JwtAuthGuard, RolesAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

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
    return await this.postService.findAll(page, limit, orderBy, order)
  }

  @Get(':id')
  @Roles('USER')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.findOne(id)
  }

  @Get('user/:userId')
  @Roles('USER')
  async findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.postService.findByUserId(userId)
  }

  @Get(':id/comments')
  @Roles('USER')
  async getAllComments(@Param('id', ParseUUIDPipe) id: string) {
    return await this.postService.getAllComments(id)
  }

  @Post()
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('image'))
  @Roles('USER')
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
  ) {
    createPostDto.photos = files.map((file) => file.path)
    return this.postService.create(createPostDto, files)
  }

  @Put(':id')
  @Roles('USER')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto)
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('USER')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.remove(id)
  }
}
