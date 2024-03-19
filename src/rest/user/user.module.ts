import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { UserController } from './controller/user.controller'
import { UserMapper } from './mapper/user-mapper'
import { BcryptService } from './services/bcrypt.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { CacheModule } from '@nestjs/cache-manager'
import { StorageModule } from '../storage/ storage.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register(),
    StorageModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper, BcryptService],
  exports: [UserService, UserMapper],
})
export class UserModule {}
