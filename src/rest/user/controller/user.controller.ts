import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserService } from '../services/user.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { JwtAuthGuard } from '../../auth/ guards/ jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../../auth/ guards/roles-auth.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { extname, join, parse } from 'path';
import { diskStorage } from 'multer'
import { Request } from 'express'

@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @CacheKey('users')
  @CacheTTL(60)
  @Roles('USER')
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.userService.findAll(query)
  }

  @Get(':id')
  @CacheKey('user')
  @CacheTTL(60)
  @Roles('USER')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOne(id)
  }

  @Get('me/profile')
  @Roles('USER')
  async getPorfile(@Req() request: any) {
    return request.user
  }

  @Get(':id/profile')
  @Roles('USER')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOne(id)
  }

  @Delete('me/profile')
  @HttpCode(204)
  @Roles('USER')
  async deleteProfile(@Req() request: any) {
    return await this.userService.remove(request.user.id)
  }

  @Put('me/profile')
  @Roles('USER')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(process.cwd(), process.env.UPLOADS_FOLDER || './photos'),
        filename: (req, file, cb) => {
          const { name } = parse(file.originalname)
          const fileName = `${Date.now()}_${name.replace(/\s/g, '')}`
          const fileExt = extname(file.originalname)
          cb(null, `${fileName}${fileExt}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png']
        const maxFileSize = 1024 * 1024
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Imagen no valida, solo se permiten archivos .jpg y .png',
            ),
            false,
          )
        } else if (file.size > maxFileSize) {
          cb(
            new BadRequestException(
              'Imagen no valida, el tamaño máximo es 1MB',
            ),
            false,
          )
        } else {
          cb(null, true)
        }
      },
    }),
  )
  async updateProfile(
    @Req() request: any,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.userService.update(request.user.id, updateUserDto, file, req)
  }

  @Get(':id/followers')
  @CacheKey('followers')
  @CacheTTL(60)
  @Roles('USER')
  async findFollowers(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getFollowers(id)
  }

  @Get(':id/following')
  @CacheKey('following')
  @CacheTTL(60)
  @Roles('USER')
  async findFollowing(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getFollowing(id)
  }

  @Post()
  @HttpCode(201)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(process.cwd(), process.env.UPLOADS_FOLDER || './photos'),
        filename: (req, file, cb) => {
          const { name } = parse(file.originalname)
          const fileName = `${Date.now()}_${name.replace(/\s/g, '')}`
          const fileExt = extname(file.originalname)
          cb(null, `${fileName}${fileExt}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png']
        const maxFileSize = 1024 * 1024
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Imagen no valida, solo se permiten archivos .jpg y .png',
            ),
            false,
          )
        } else if (file.size > maxFileSize) {
          cb(
            new BadRequestException(
              'Imagen no valida, el tamaño máximo es 1MB',
            ),
            false,
          )
        } else {
          cb(null, true)
        }
      },
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.userService.create(createUserDto, file, req)
  }

  @Put(':id')
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(process.cwd(), process.env.UPLOADS_FOLDER || './photos'),
        filename: (req, file, cb) => {
          const { name } = parse(file.originalname)
          const fileName = `${Date.now()}_${name.replace(/\s/g, '')}`
          const fileExt = extname(file.originalname)
          cb(null, `${fileName}${fileExt}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png']
        const maxFileSize = 1024 * 1024
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Imagen no valida, solo se permiten archivos .jpg y .png',
            ),
            false,
          )
        } else if (file.size > maxFileSize) {
          cb(
            new BadRequestException(
              'Imagen no valida, el tamaño máximo es 1MB',
            ),
            false,
          )
        } else {
          cb(null, true)
        }
      },
    }),
  )
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.userService.update(id, updateUserDto, file, req)
  }

  @Post('follow')
  @HttpCode(201)
  @Roles('USER')
  async followUser(
    @Body('userId') userId: string,
    @Body('userToFollowId') userToFollowId: string,
  ) {
    return this.userService.followUser(userId, userToFollowId)
  }

  @Post('unfollow')
  @HttpCode(201)
  @Roles('USER')
  async unfollowUser(
    @Body('userId') userId: string,
    @Body('userToUnfollowId') userToUnfollowId: string,
  ) {
    return this.userService.unfollowUser(userId, userToUnfollowId)
  }

  @Post('like')
  @HttpCode(201)
  @Roles('USER')
  async likePost(
    @Body('userId') userId: string,
    @Body('postId') postId: string,
  ) {
    return this.userService.likePost(userId, postId)
  }

  @Post('unlike')
  @HttpCode(201)
  @Roles('USER')
  async unlikePost(
    @Body('userId') userId: string,
    @Body('postId') postId: string,
  ) {
    return this.userService.unlikePost(userId, postId)
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('ADMIN')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.remove(id)
  }

  @Post('check')
  @HttpCode(200)
  @Roles('USER')
  async checkUser(@Body('username') username: string, @Body('password') password: string) {
    return await this.userService.checkUser(username, password)
  }
}
