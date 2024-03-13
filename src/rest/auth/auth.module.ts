import { AuthController } from './controller/auth.controller'
import { UserModule } from '../user/user.module'
import * as process from 'process'
import { PassportModule } from '@nestjs/passport'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthStrategy } from './ strategies/ jwt-strategy'
import { AuthService } from './services/ auth.service'
import { AuthMapper } from './mapper/ auth-mapper'

@Module({
  imports: [
    JwtModule.register({
      secret: Buffer.from(
        process.env.TOKEN_SECRET || 'secret',
        'utf-8',
      ).toString('base64'),
      signOptions: {
        expiresIn: Number(process.env.TOKEN_EXPIRES) || 3600,
        algorithm: 'HS512',
      },
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper, JwtAuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
