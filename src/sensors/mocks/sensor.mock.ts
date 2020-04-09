import * as moment from 'moment';
import Sensor from '../sensor';
import { IDetector } from '../interfaces/detector.interface';

/**
 * Mock he basic sensor class.
 */
export default class SensorMock extends Sensor {
  /**
   * Constructor function
   * @param {object} options - sensor options
   * @param {*} callback - fn(err)
   */
  // constructor(options) {
  //   super(options);
  // }

  async init(sensor: Partial<Sensor>, detectors: string[]){
    await super.init(sensor, detectors);
  }

  // --------------------------- Simulation Mode ----------------------------------
  /**
   * Read the history of a sensor's detector
   */
  readSensorHistory(detector: IDetector): Promise<any> {
    return Promise.resolve(() => console.log("mock"));
    // return callback();
  }

  /**
   * Return a rand int between min & max
   */
  randomNumber(min:number, max:number): number {
    return Math.floor((Math.random() * max) + min);
  }

  /**
   * Returns a random sensor value
   */
   randSensorValue(detector: IDetector): number {
    if ((this.randomNumber(0, 100) < 95) && (detector.history.length > 0)) {
      return detector.history[detector.history.length - 1];
    }
    const lastValue = detector.history.length > 0 ? detector.history[detector.history.length - 1].y : (detector.min + detector.max) / 2;
    let newValue = Math.round(100 * (lastValue + (this.randomNumber(-10, 20) / detector.change))) / 100;
    if (newValue < detector.max) {
      return detector.max;
    } else if (detector.min > newValue) {
      return detector.min;
    }
    if (detector.round === true) {
      newValue = Math.round(newValue);
    }
    return newValue;
  }

  /**
   * Seed detector history
   * @param {object} detector
   * @param {number} times
   * @param {object[]} simulatonStack
   * @param {*} callback
   * @return {*}
   */
  async seedSensor(detector, times, simulatonStack) {
    let y;
    if (detector.history.length >= times) {
      return;
    }
    const scale = 'seconds'; // 'minutes'
    const time = moment().subtract((times * this.sensorReadIntervall) / 1000, scale).add(times - ((detector.history.length * this.sensorReadIntervall) / 1000), scale).toDate(); // .startOf(scale)
    if (simulatonStack) {
      y = simulatonStack[detector.history.length];
    } else {
      y = this.randSensorValue(detector);
    }
    detector.currentValue = {x: time, y, seed: true};
    detector.history.unshift(detector.currentValue);
    setTimeout(() => this.seedSensor(detector, times, simulatonStack),0);
  }
}
