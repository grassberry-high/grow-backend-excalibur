import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { ChambersController } from './chambers.controller';
import { AppService } from '../app.service';
import { ChambersService } from './chambers.service';

@Module({
  controllers: [AppController, ChambersController],
  providers: [AppService, ChambersService],
})
export class ChambersModule {
}
