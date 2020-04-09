import SensorMock from '../../mocks/sensor.mock';
const HISTORY_LENGTH = 30;

import * as moment from 'moment';
import debug from 'debug';
import co2 from '../../mocks/simulation/co2-simulation';
import Sensor from 'src/sensors/sensor';

const debugCO2 = debug('sensor:co2');

const simulation = {
  co2,
};

/**
 * Mock of the MHZ16 co2 sensor.
 */
export default class Mhz16SensorMock extends SensorMock {
  simulationCounter;
  
  async initMhz16(sensor: Partial<Sensor>, detectors: string[]) {
    console.log('My name is', sensor._id);
    super.init(sensor, detectors);
    this.simulationCounter = HISTORY_LENGTH;
    for (const detector of this.detectors) {
      detector.round = true;
      detector.min = 550;
      detector.max = 2000;
      detector.change = 1;
      await this.seedSensor(
        detector,
        HISTORY_LENGTH,
        simulation[detector.type],
      );
      await this.readSensor();
    }
  }

  /**
   * read co2 value
   */
  readSensor() {
    this.simulationCounter++;
    if (this.simulationCounter > 999) {
      this.simulationCounter = 0;
    }
    try {
      for (const detector of this.detectors) {
        if (detector.type === 'co2') {
          const co2 = simulation.co2[this.simulationCounter];
          debugCO2(
            `CO2: PPM  ${co2} (adr ${this.address}) ${moment().format(
              'hh:mm:ss DD-MM-YYYY',
            )}`,
          );
          this.processSensorValue(detector, co2);
        } else {
          throw 'Detector type not implemented';
        }
      }
    } catch (err) {
      console.error('CO2 err', err);
      setTimeout(() => this.readSensor(), this.sensorReadIntervall);
    }
  }
}
