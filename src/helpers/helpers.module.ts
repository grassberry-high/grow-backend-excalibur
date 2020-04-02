import { Module } from '@nestjs/common';
import { BsonToJsonService } from './bson-to-json/bson-to-json.service';
import { ComparisonService } from './comparison/comparison.service';
import { LoggerModule } from './logger/logger.module';
import { SocketIOMessengerModule } from './socket-io-messenger/socket-io-messenger.module';
import { OutputAndSensorBootModule } from './output-and-sensor-boot/output-and-sensor-boot.module';
import { SensorsService } from 'src/sensors/sensors.service';
// import { ConversionModule } from './conversion/conversion.module';

@Module({
  imports: [LoggerModule, SocketIOMessengerModule, OutputAndSensorBootModule],
  providers: [BsonToJsonService, ComparisonService],
  exports: [LoggerModule],
})
export class HelpersModule {}
