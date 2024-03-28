import {
  BadRequestException,
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
  Req,
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
import { diskStorage } from 'multer'
import { extname, parse } from 'path'
import { Request } from 'express'

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

  @Get('username/:username')
  @Roles('USER')
  async findByUsername(@Param('username') username: string) {
    return await this.postService.getUserByUsername(username)
  }

  @Get(':id/comments')
  @Roles('USER')
  async getAllComments(@Param('id', ParseUUIDPipe) id: string) {
    return await this.postService.getAllComments(id)
  }

  @Get('user/:userId/liked')
  @Roles('USER')
  async findPostsLikedByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.postService.findPostsLikedByUser(userId);
  }

  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FilesInterceptor('image', 7, {
      storage: diskStorage({
        destination: process.env.UPLOADS_FOLDER || './photos',
        filename: (req, file, cb) => {
          const { name } = parse(file.originalname)
          const fileName = `${Date.now()}_${name.replace(/\s/g, '')}`
          const fileExt = extname(file.originalname)
          cb(null, `${fileName}${fileExt}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|heic)$/)) {
          cb(null, true)
        } else {
          cb(new BadRequestException('Formato de archivo no soportado'), false)
        }
        if (req.files.length > 7) {
          cb(
            new BadRequestException('No puedes subir mas de 7 archivos'),
            false,
          )
        } else {
          cb(null, true)
        }
      },
    }),
  )
  @Roles('USER')
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No hay imágenes')
    }
    createPostDto.photos = files.map((file) => file.path)
    return this.postService.create(createPostDto, files, req)
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
