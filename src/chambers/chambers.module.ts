import { Module } from '@nestjs/common';
import { ChambersController } from './chambers.controller';
import { ChambersService } from './chambers.service';
import { Chamber } from './chamber.model';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [TypegooseModule.forFeature([Chamber])],
  controllers: [ChambersController],
  providers: [ChambersService],
})
export class ChambersModule {
}
