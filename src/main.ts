import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable cors and setup for angular
  app.enableCors({
    credentials: true, origin: true
  });

  await app.listen(3000);
}
bootstrap();
