import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 글로벌 ValidationPipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 전역 성공 응답 Interceptor 등록
  app.useGlobalInterceptors(new TransformInterceptor());

  // 전역 예외 처리 Filter 등록
  app.useGlobalFilters(new AllExceptionsFilter());


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
