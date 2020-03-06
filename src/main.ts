import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SpelunkerModule } from 'nestjs-spelunker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.LOG_DEPENDENCIES === 'true') {
    SpelunkerModule.explore(app);
  }

  // set prefix for routes, for easier nginx int.
  app.setGlobalPrefix('core');

  // enable cors and setup for angular
  app.enableCors({
    credentials: true, origin: true
  });

  await app.listen(3000);
}
bootstrap();
