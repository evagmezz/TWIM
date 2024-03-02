import { Module } from '@nestjs/common'
import { PostService } from './services/post.service'
import { PostController } from './controller/post.controller'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { PostMapper } from './mapper/post-mapper'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { Post } from './entities/post.entity'

@Module({
  imports: [
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
  ],
  controllers: [PostController],
  providers: [PostService, PostMapper],
})
export class PostModule {}
