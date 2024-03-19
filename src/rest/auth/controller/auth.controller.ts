import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UserSignInDto } from '../dto/user-sign.in.dto'
import { AuthService } from '../services/ auth.service'
import { UserSignUpDto } from '../dto/ user-sign.up.dto'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('photo'))
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
