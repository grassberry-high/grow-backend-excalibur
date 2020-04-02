import * as moment from 'moment';
import debug from 'debug';
import SensorMock from '../../mocks/sensor.mock';

const HISTORY_LENGTH = 30;
const WATERLEVELS = ['Dry', 'Moist', 'Wet'];

/**
 * Mock of the Chirp water level sensor.
 */
export default class ChirpSensorMock extends SensorMock {
  debugSensorChrip;
  detectors;

  // constructor(options) {
  //   super(options);
  //   this.debugSensorChrip = debug('sensor:water');
  //   this.debugSensorChrip.enabled = true;
  // }

  async initChirp(options) {
    // await super.init(options);
    this.debugSensorChrip(`Chirp sensor mock ${options._id}`);
    this.detectors.forEach(async (detector) => {
      detector.min = 1;
      detector.max = 2;
      detector.round = true;
      detector.change = 10;
      // await this.seedSensor(detector, HISTORY_LENGTH, null);
      this.readSensor();
    });
  }

  /**
   * read sensor water level
   */
  async readSensor() {
    const waterLevel = this.randSensorValue(this.detectors[0]);
    this.debugSensorChrip(`WATERLEVEL: ${WATERLEVELS[waterLevel]} ${moment().format('hh:mm:ss DD-MM-YYYY')}`);
    // await this.processSensorValue(this.detectors[0], waterLevel);
    // await setTimeout(() => this.readSensor(), this.sensorReadIntervall);
    return;
  }
}
