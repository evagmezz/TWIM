import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { UserController } from './controller/user.controller'
import { UserMapper } from './mapper/user-mapper'
import { BcryptService } from './services/bcrypt.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { CacheModule } from '@nestjs/cache-manager'
import { StorageModule } from '../storage/ storage.module'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { Post } from '../post/entities/post.entity'
import * as mongoosePaginate from 'mongoose-paginate-v2'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeatureAsync([
      {
        name: Post.name,
        useFactory: () => {
          const schema = SchemaFactory.createForClass(Post)
          schema.plugin(mongoosePaginate)
          return schema
        },
      },
    ]),
    CacheModule.register(),
    StorageModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper, BcryptService],
  exports: [UserService, UserMapper],
})
export class UserModule {}
