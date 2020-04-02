import { Module } from '@nestjs/common';
import { OutputAndSensorBootService } from './output-and-sensor-boot.service';
// import { SensorsModule } from 'src/sensors/sensors.module';
import { I2cModule } from 'src/i2c/i2c.module';
import { SensorsService } from 'src/sensors/sensors.service';
import { I2cService } from 'src/i2c/i2c.service';
import { SensorsModule } from 'src/sensors/sensors.module';

@Module({
  imports: [I2cModule,
    SensorsModule],
  providers: [OutputAndSensorBootService, SensorsService, I2cService]
})
export class OutputAndSensorBootModule {}
