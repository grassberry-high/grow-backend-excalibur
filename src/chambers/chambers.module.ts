import { Module } from '@nestjs/common';
import { ChambersController } from './chambers.controller';
import { ChambersService } from './chambers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChamberSchema } from './schemas/chamber.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Chamber', schema: ChamberSchema }])],
  controllers: [ChambersController],
  providers: [ChambersService],
})
export class ChambersModule {
}
