import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { setUpSwagger } from './utils/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app
    .use(cookieParser())
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // decorator(@)가 없는 속성이 들어오면 해당 속성은 제거하고 받아들인다.
        forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 넘어오면 request 자체를 막는다.
      }),
    )
    .enableCors({
      credentials: true,
      // origin: true,
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  setUpSwagger(app);
  await app.listen(5555);
}
bootstrap();
