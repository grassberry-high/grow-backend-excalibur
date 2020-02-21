import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChambersModule } from './chambers/chambers.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ChambersModule,
    MongooseModule.forRoot('mongodb://localhost/LOC_gh')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
