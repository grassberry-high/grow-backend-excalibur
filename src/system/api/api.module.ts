import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { HelpersModule } from '../../helpers/helpers.module';

@Module({
  imports: [HelpersModule],
  providers: [ApiService],
  exports: [ApiService]
})
export class ApiModule {}
