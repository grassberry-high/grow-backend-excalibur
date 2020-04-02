import * as dotenv from 'dotenv'; // ConfigModule is not importing early enough for DI
dotenv.config();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChambersModule } from './chambers/chambers.module';
import {TypegooseModule} from "nestjs-typegoose";
import { SensorsModule } from './sensors/sensors.module';
import { I2cModule } from './i2c/i2c.module';
import { SystemModule } from './system/system.module';
import { LoggerModule } from './helpers/logger/logger.module';
import { DataLoggerModule } from './data-logger/data-logger.module';
import SensorMock from './sensors/mocks/sensor.mock';
import debug from "debug";
import * as moment from "moment";
import socket from "socket.io";
import { SocketIOMessengerService } from './helpers/socket-io-messenger/socket-io-messenger.service';
import { I2cService } from './i2c/i2c.service';
import { OutputAndSensorBootService } from './helpers/output-and-sensor-boot/output-and-sensor-boot.service';
import { OutputAndSensorBootModule } from './helpers/output-and-sensor-boot/output-and-sensor-boot.module';
import { SocketIOMessengerModule } from './helpers/socket-io-messenger/socket-io-messenger.module';
import { HelpersModule } from './helpers/helpers.module';
// import {getLicenseInformation, bootLicenseCronjob} from ('./system/system.update');
const debugBoot = debug('boot');

@Module({
  imports: [
    ChambersModule,
    TypegooseModule.forRoot('mongodb://localhost/LOC_gh',  { useNewUrlParser: true, useCreateIndex: true }),
    SensorsModule,
    HelpersModule,
    SocketIOMessengerService,
    OutputAndSensorBootService,
    I2cModule,
    SystemModule,
    LoggerModule,
    DataLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, SensorMock, SocketIOMessengerService, OutputAndSensorBootService]
})
export class AppModule {

  constructor(
    private readonly socketio: SocketIOMessengerService,
    private readonly i2cService: I2cService,
    private readonly outputAndSensorBootService: OutputAndSensorBootService
  ){}

// getLocalTime = (format) => {
//   const localTime = this.formatTimeToLocalTime(moment(), format);
//   debugHelperConversion('localTime', localTime);
//   return localTime;
// };

  async boot() {
    // debugBoot('-->Socket Messenger<--');
    // const io = socket(server);
    // initSocketListener(io);
    // startSeeding(next);
    // debugBoot('-->License<--');
    // const options = {};
    // getLicenseInformation(options, (err) => {
    //   if (err) {
    //     console.error(err);
    //   }
    //   return next();
    // });
  
    debugBoot('-->I2C<--');
    await this.i2cService.bootI2C();
    debugBoot('-->Sensors & Relays<--');
    const bootOptions = {};
    await this.outputAndSensorBootService.bootSensorsAndRelays(bootOptions);
  }

  async onModuleInit() {
    const startProcessTime = moment();
    try {
      await this.boot()
      debugBoot('-->Boot Completed<--');
      debugBoot(`Booting took ${moment().diff(startProcessTime, 'seconds')} seconds`);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
