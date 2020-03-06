import { Module } from '@nestjs/common';
import { I2cService } from './i2c.service';

@Module({
  providers: [I2cService]
})
export class I2cModule {}
