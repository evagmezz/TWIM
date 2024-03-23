import { Module } from '@nestjs/common'
import { CommentService } from './services/comment.service'
import { CommentController } from './controller/comment.controller'
import { CommentMapper } from './mapper/comment-mapper'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { Comment } from './entities/comment.entity'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { CacheModule } from '@nestjs/cache-manager'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Comment.name,
        useFactory: () => {
          const schema = SchemaFactory.createForClass(Comment)
          schema.plugin(mongoosePaginate)
          return schema
        },
      },
    ]),
    CacheModule.register(),
    UserModule,
  ],
  exports: [MongooseModule],
  controllers: [CommentController],
  providers: [CommentService, CommentMapper],
})
export class CommentModule {}
