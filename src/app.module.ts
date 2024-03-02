import { Module } from '@nestjs/common'
import { UserModule } from './rest/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './config/database/ database.module'
import { PostModule } from './rest/post/post.module'
import { CommentModule } from './rest/comment/comment.module'
import { LocationModule } from './rest/location/location.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as ormconfig from './config/database/ormconfig'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...ormconfig,
      keepConnectionAlive: true,
      autoLoadEntities: true,
    }),
    UserModule,
    DatabaseModule,
    PostModule,
    CommentModule,
    LocationModule,
  ],
  providers: [],
})
export class AppModule {}
