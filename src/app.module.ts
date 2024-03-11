import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './rest/user/user.module'
import { PostModule } from './rest/post/post.module'
import { CommentModule } from './rest/comment/comment.module'
import { DatabaseModule } from './config/database/ database.module'
import { ChatModule } from './ws/chat/chat.module'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    DatabaseModule,
    PostModule,
    CommentModule,
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  providers: [],
})
export class AppModule {}
