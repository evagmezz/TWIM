import { Module } from '@nestjs/common'
import { UserModule } from './rest/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { PostModule } from './rest/post/post.module'
import { CommentModule } from './rest/comment/comment.module'
import { DatabaseModule } from './config/database/ database.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    DatabaseModule,
    PostModule,
    CommentModule,
  ],
  providers: [],
})
export class AppModule {}
