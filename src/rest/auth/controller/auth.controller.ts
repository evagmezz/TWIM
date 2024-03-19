import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { UserSignInDto } from '../dto/user-sign.in.dto'
import { UserSignUpDto } from '../dto/ user-sign.up.dto'
import { AuthService } from '../services/ auth.service'
import { Request } from 'express'
import { diskStorage } from 'multer'
import { extname, parse } from 'path'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(
    FileInterceptor('image', {
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
  async signUp(
    @UploadedFile() file: Express.Multer.File,
    @Body() userSignUpDto: UserSignUpDto,
    @Req() req: Request,
  ) {
    return await this.authService.signUp(userSignUpDto, file, req)
  }

  @Post('signin')
  async signIn(@Body() userSignInDto: UserSignInDto) {
    return await this.authService.signIn(userSignInDto)
  }
}
