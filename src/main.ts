import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  if(process.env.NODE_ENV === 'dev'){
    console.log('Development mode')
  } else {
    console.log('Production mode')
  }
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT || 3000)
}

bootstrap().then(() =>
  console.log(
    `Server is running on ${process.env.PORT || 3000} port and version ${
      process.env.VERSION || '1.0.0'
    }`,
  ),
)
