import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChambersModule } from './chambers/chambers.module';

@Module({
  imports: [ChambersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
