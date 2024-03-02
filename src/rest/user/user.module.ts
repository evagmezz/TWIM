import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { UserController } from './controller/user.controller'
import { UserMapper } from './mapper/user-mapper'
import { BcryptService } from './services/bcrypt.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserMapper, BcryptService],
})
export class UserModule {}
