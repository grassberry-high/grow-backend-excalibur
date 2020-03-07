import { Injectable } from '@nestjs/common';
import { SensorsService } from './sensors/sensors.service';
import { SystemReadService } from './system/services/system-read.service';

@Injectable()
export class AppService {
  constructor(
    private systemReadService: SystemReadService,
    private sensorsService: SensorsService
  ){
    this.init().then( console.log )
  }

  async init () {
    await this.sensorsService.bootSensors({});
  }

}
