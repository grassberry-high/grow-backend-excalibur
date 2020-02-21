import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { ChambersController } from './chambers.controller';
import { AppService } from '../app.service';
import { ChambersService } from './chambers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChamberSchema } from './schemas/chamber.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Chamber', schema: ChamberSchema }])],
  controllers: [AppController, ChambersController],
  providers: [AppService, ChambersService],
})
export class ChambersModule {
}
