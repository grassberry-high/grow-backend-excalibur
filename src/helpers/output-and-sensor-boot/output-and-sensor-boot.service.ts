import { Injectable } from '@nestjs/common';
import debug from 'debug';
import { SensorsService } from 'src/sensors/sensors.service';
import { I2cService } from 'src/i2c/i2c.service';
const debugBoot = debug('boot');

const SCAN_INTERVALL = 1000;
const RELAIS_CONTROLLER = 32;

// const {bootRelays} = require('../relay/relay.service.js');
// const {bootSensors} = require('../sensor/sensor.service.js');
// const {stopCronjobs, launchCronjobs} = require('../cronjob/cronjob.service.js');

@Injectable()
export class OutputAndSensorBootService {
  constructor(
    private readonly sensorService: SensorsService,
    private readonly i2cService: I2cService,
  ) {}

  watchActive = false;

  /**
   * Boot all sensors and relays
   * @param {object} options
   * @return {*}
   */
  bootSensorsAndRelays(options) {
    const promises = [];
    if (!options.noSensors)
      promises.push(
        Promise.resolve(() => {
          debugBoot('-->Booting Sensors<--');
          this.sensorService.bootSensors(options);
        }),
      );

    // if (!options.noRelays)
    // TODO:

    // if (!options.noRelays && !process.env.NO_CRONS)
    //     promises.push(() => {
    //       Promise.resolve(debugBoot('-->Booting Cronjobs<--'));
    //       stop
    if (this.watchActive) this.watch();
  }

  watch() {
    this.watchActive = true;
    setInterval(async () => {
      const result = await this.i2cService.checkDifference();
      const { differenceAdded, differenceLost } = result;
      if (differenceAdded.length > 0) {
        const bootOptions = {
          noCrons: true,
          additive: true,
          filterRead: { address: { $in: differenceAdded } },
          noRelays: false,
        };
        if (
          differenceLost.indexOf(RELAIS_CONTROLLER) === -1 &&
          differenceAdded.indexOf(RELAIS_CONTROLLER) === -1
        ) {
          bootOptions.noRelays = true;
        }
        this.bootSensorsAndRelays(bootOptions);
      }
    }, SCAN_INTERVALL);
  }
}
	