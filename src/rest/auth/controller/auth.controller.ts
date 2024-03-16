import { Body, Controller, Post } from '@nestjs/common'
import { UserSignUpDto } from '../dto/ user-sign.up.dto'
import { AuthService } from '../services/ auth.service'
import { UserSignInDto } from '../dto/user-sign.in.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async singUp(@Body() userSignUpDto: UserSignUpDto) {
    return await this.authService.signUp(userSignUpDto)
  }

  @Post('signin')
  async singIn(@Body() userSignInDto: UserSignInDto) {
    return await this.authService.signIn(userSignInDto)
  }
}
