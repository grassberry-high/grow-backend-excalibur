import SensorMock from '../../mocks/sensor.mock';
import debug from 'debug';
import * as moment from 'moment';
import { IDetector } from 'src/sensors/interfaces/detector.interface';
const debugTemp = debug('sensor:temp');
const debugHumidity = debug('sensor:humidity');
const HISTORY_LENGTH = 30;
import temperature from "../../mocks/simulation/temperature-simulation";
import humidity from "../../mocks/simulation/humidity-simulation";
import { SystemReadService } from 'src/system/services/system-read.service';
import Sensor from 'src/sensors/sensor';

const simulation = {
  temperature,
  humidity
};

/**
 * Mock of the HDC1000 temperature/humidity sensor.
 */

/**
 * Mock of the HDC1000 temperature/humidity sensor.
 */
export default class Hdc1000SensorMock extends SensorMock {
  simulationCounter;

  async initHdc1000(sensor: Partial<Sensor>, detectors: string[]) {
    super.init(sensor, detectors)
    console.log('Mock hdc1000', sensor._id);
    debugTemp(`Temp/Humdity sensor mock ${sensor._id}`);
    this.simulationCounter = HISTORY_LENGTH;
    for (const detector of this.detectors) {
      switch (detector.type) {
        case 'temperature':
          detector.min = 20;
          detector.max = 40;
          break;
        case 'humidity':
          detector.min = 50;
          detector.max = 80;
          break;
      }
      detector.change = 100;
      this.seedSensor(detector, HISTORY_LENGTH, simulation[detector.type]);
      Hdc1000SensorMock.boot();
      this.readSensor();
    }
  }

  /**
   * Seed detector history
   */
  async seedSensor(detector: IDetector, times: number, simulatonStack: object[]) {
    let y;
    if (detector.history.length >= times) {
      return;
    }
    const scale = 'seconds'; // 'minutes'
    const time = moment()
      .subtract((times * this.sensorReadIntervall) / 1000, scale)
      .add(
        times - (detector.history.length * this.sensorReadIntervall) / 1000,
        scale,
      )
      .toDate(); // .startOf(scale)
    if (simulatonStack) {
      y = simulatonStack[detector.history.length];
    } else {
      y = this.randSensorValue(detector);
    }
    detector.currentValue = { x: time, y, seed: true };
    detector.history.unshift(detector.currentValue);
    setTimeout(() => this.seedSensor(detector, times, simulatonStack), 0);
  }
  /**,
    ], (err) => {
      return callback(err, this);
    });
    */
  // }

  /**
   * Boots the sensor
   */
  static boot() {
    return;
  }

  /**
   * read sensor hum/temp values
   */
  async readSensor() {
    this.simulationCounter++;
    if (this.simulationCounter >= 999) {
      this.simulationCounter = 0;
    }
    try {
      for (const detector of this.detectors) {
        switch (detector.type) {
          case 'temperature':
            const temperature = simulation.temperature[this.simulationCounter];
            debugTemp(
              `TEMPERATURE: ${temperature} (adr ${
                this.address
              }) ${moment().format('hh:mm:ss DD-MM-YYYY')}`,
            );
            await this.processSensorValue(detector, temperature);
            break;
          case 'humidity':
            const humidity = simulation.humidity[this.simulationCounter];
            debugHumidity(
              `HUMIDITY: ${humidity} (adr ${this.address})}  ${moment().format(
                'hh:mm:ss DD-MM-YYYY',
              )}`,
            );
            await this.processSensorValue(detector, humidity);
            break;
          default:
            throw `Detector type ${detector.type} not implemented`;
        }
      }
    } catch (error) {
      if (error) {
        console.error('@hdc1000', error);
      }
    }
    setTimeout(() => this.readSensor(), this.sensorReadIntervall);
  }
}