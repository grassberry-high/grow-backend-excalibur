import { Module } from '@nestjs/common';
import { I2cService } from './i2c.service';
import { I2cServiceMock } from './mocks/i2c.mock';

const i2cProvider = { provide: I2cService, useClass: process.env.SIMULATION === 'true' ? I2cServiceMock :  I2cService };

@Module({
  providers: [i2cProvider],
  exports: [i2cProvider]
})
export class I2cModule {}
