import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';

const HISTORY_LENGTH = 30;
const ONE_SECOND_IN_MILLISECONDS = 1000;
const ONE_MINUTE_IN_MILLISECONDS = 60 * ONE_SECOND_IN_MILLISECONDS;
const ONE_HOUR_IN_MILLISECONDS = 60 * ONE_MINUTE_IN_MILLISECONDS;
const STATISTIC_INTERVALL = HISTORY_LENGTH * 60 * 1000; // max time unit is hours

import debug from 'debug';
import { Sensor as SensorModel, Tech } from './sensors.model';

const debugSensorFilter = debug('sensor:filter');
const debugSensorBroadcast = debug('sensor:broadcast');
/*
const debugSensorSwitch = debug('sensor:switch');
const debugSensorSwitchVerbose = debug('sensor:switch:verbose');
const debugSensorSwitchBlockers = debug('sensor:switch:blockers');
*/

import { orderBy, sortBy } from 'lodash';
import * as moment from 'moment';
import * as fs from 'fs';
import KalmanFilter from 'kalmanjs';

import { IDetector } from './interfaces/detector.interface';
import { I2cService } from '../i2c/i2c.service';
import { ReturnModelType } from '@typegoose/typegoose';
import { SensorReading, Unit } from '../data-logger/sensor-reading';
import { promisify } from 'util';

/**
 * Basic sensor class
 */
export default class Sensor {
  _id: string;
  model: string;
  detectors: IDetector[];
  technology: Tech;
  i2c1: object;
  kalmanFilter: KalmanFilter;
  address: number;
  sensorReadIntervall: number;
  sensorPushIntervall: number;
  sensorWriteIntervall: number;
  timeUnit: Unit;
  modes: any;

  constructor(
    private readonly i2cService: I2cService,
    @InjectModel(SensorModel)
    private readonly sensorModel: ReturnModelType<typeof SensorModel>,
    @InjectModel(SensorReading)
    private readonly sensorReadingModel: ReturnModelType<typeof SensorReading>,
  ) {
    return;
  }

  async init(
    id: string,
    model: string,
    technology: Tech,
    detectors: IDetector[],
    modes: any,
    timeUnit?: Unit,
  ) {
    this._id = id;
    this.model = model;
    this.detectors = detectors;

    this.technology = technology;

    if (this.technology === 'i2c') this.i2c1 = this.i2cService.getI2cBus();

    this.sensorReadIntervall = 1000; // read sensor each s
    this.sensorPushIntervall = 5000; // push sensor each 5s
    this.sensorWriteIntervall = 5000; // write sensor each 5s
    this.timeUnit = timeUnit || Unit['seconds'];
    debugSensorFilter(modes);
    this.modes = modes || { adjustValues: 5 };

    if (this.modes.kalman != null) {
      this.kalmanFilter = new KalmanFilter(this.modes.kalman); // R internal variation, Q expected variation through noise
    }

    this.detectors.forEach(async detector => {
      detector.history = [];
      detector.shortBuffer = [];
      detector.currentValue = null;
      const history = await this.readSensorHistory(detector);
      detector.history = history || [];
    });
    // this.buildStatistic();
    return;
  }

  // // --------------------------- Statistic & Clean up --------------------------------------
  /**
   * Build sensor statistic
   */
  buildStatistic() {
    // builds a statistic and removes values older than 48h
    setTimeout(() => {
      this.detectors.map(detector =>
        // todo first build a statistic
        this.sensorReadingModel
          .remove({
            sensor: this._id,
            detectorType: detector.type,
            timestamp: {
              $gt: moment()
                .subtract(48, 'hours')
                .toDate(),
            },
          })
          .exec(err => {
            if (err) {
              // return logger.error;
            }
          }),
      );
    }, STATISTIC_INTERVALL);
  }

  // --------------------------- Sensor Process, Write & Broadcast --------------------------------------
  /**
   * Check if last write is long enough ago
   */
  checkWrite(detector: IDetector): boolean {
    if (
      !detector.lastWrite ||
      moment().diff(detector.lastWrite) >= this.sensorWriteIntervall
    ) {
      detector.lastWrite = moment().toDate();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Check if last push is long enough ago
   */
  checkPush(detector: IDetector): boolean {
    // console.log "#{detector.type} diff #{moment().diff(detector.lastPush)} #{@.timeUnit} #{@.sensorPushIntervall}"
    if (
      !detector.lastPush ||
      moment().diff(detector.lastPush) >= this.sensorPushIntervall
    ) {
      detector.lastPush = moment().toDate();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Change the measuring interval
   */
  async changeSensorTimeUnit(newTimeUnit: string) {
    switch (newTimeUnit) {
      case 'seconds':
        this.sensorPushIntervall = 5 * ONE_SECOND_IN_MILLISECONDS; // ms
        break;
      case 'minutes':
        this.sensorPushIntervall = ONE_MINUTE_IN_MILLISECONDS;
        break;
      case 'hours':
        this.sensorPushIntervall = ONE_HOUR_IN_MILLISECONDS;
        break;
    }

    this.timeUnit = Unit[newTimeUnit];
    this.detectors.forEach(async detector => {
      const history = await this.readSensorHistory(detector);
      detector.history = history || [];
    });
  }

  /**
   * Broadcast the sensor history to the FE
   */
  broadcastSensorHistory() {
    debugSensorBroadcast('Broadcasting sensorData', { payload: this });
    // sendMessage('sensorData', {'payload': this});
  }

  //
  /**
   * Save values in pipe buffer
   */
  adjustValue(detector: IDetector, value: number): number {
    const nrValues = this.modes.adjustValues;
    if (detector.shortBuffer.length >= nrValues) {
      value =
        (value +
          detector.shortBuffer
            .slice(detector.shortBuffer.length - nrValues)
            .reduce((prev, curr) => prev + curr)) /
        (nrValues + 1);
      detector.shortBuffer.push(value);
      if (detector.shortBuffer.length > nrValues) {
        detector.shortBuffer.shift();
      }
    } else {
      detector.shortBuffer.push(value);
    }
    return value;
  }

  /**
   * Process the sensor value
   */
  async processSensorValue(
    detector: IDetector,
    newValue: number,
    round?: boolean,
  ) {
    if (isNaN(newValue)) {
      return;
    }
    if (this.modes.adjustValues != null) {
      newValue = this.adjustValue(detector, newValue);
    } else if (this.kalmanFilter != null) {
      const historyY = detector.history.map(value => value.y);
      historyY.push(newValue);
      debugSensorFilter(`Before Kalman: ${newValue}`);

      const appendProm = promisify(fs.appendFile);

      if (process.env.LOG_KALMAN === 'true') {
        await appendProm(
          process.env.APP_PATH + `/logs/kalman_${detector.name}.csv`,
          `${newValue};`,
          'utf-8',
        );
      }

      newValue = historyY.map(value => this.kalmanFilter.filter(value)).pop();
      debugSensorFilter(`After Kalman: ${newValue}`);

      if (process.env.LOG_KALMAN === 'true') {
        await appendProm(
          process.env.APP_PATH + `/logs/kalman_${detector.name}.csv`,
          `${newValue}\n`,
          'utf-8',
        );
      }
    }

    if (round) {
      newValue = Math.round(newValue);
    }
    detector.currentValue = { x: moment().toDate(), y: newValue }; // .startOf('minute')

    if (this.checkPush(detector)) {
      detector.history.push(detector.currentValue);
      if (detector.history.length > HISTORY_LENGTH) {
        detector.history.shift();
      }
      detector.history = orderBy(detector.history, 'x');
      this.broadcastSensorHistory();
    }

    if (this.checkWrite(detector)) {
      try {
        this.sensorReadingModel.create({
          value: detector.currentValue['y'],
          timestamp: detector.currentValue['x'],
          detectorType: detector.type,
          sensor: this._id,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  // --------------------------- Sensor Read --------------------------------------
  /**
   * Filter the sensor's history
   */
  filterSensorHistory(data: any) {
    //sort data descendigly
    const sortedData = sortBy(data, 'timestamp').reverse();

    // add 5 units to the latest entry (for processing delay), works seconds & minutes
    const latestEntry = moment(data[0].timestamp).add(5, this.timeUnit);

    const filterData = (data, currLatest) =>
      data.filter(dataItem => {
        // if less than 1 time unit diff. with latestEntry
        if (currLatest.diff(moment(dataItem.timestamp), this.timeUnit) <= 1) {
          return false;
        }
        currLatest = moment(dataItem.timestamp);
        return true;
      });

    const splice = data => data.splice(0, HISTORY_LENGTH);

    const setXandY = data =>
      data.map(dataItem => ({
        x: moment(dataItem.timestamp).toDate(),
        y: dataItem.value,
      }));

    return setXandY(splice(filterData(sortedData, latestEntry)));
  }

  /**
   * Read the sensor's history
   */
  async readSensorHistory(detector: IDetector) {
    let since;

    if (this.timeUnit === 'seconds') {
      since = moment()
        .subtract((HISTORY_LENGTH + 1) * this.sensorReadIntervall, 'seconds')
        .toISOString();
    } else {
      since = moment()
        .subtract(HISTORY_LENGTH + 1, this.timeUnit)
        .toISOString();
    }

    const filterReadSensor = {
      sensor: new Types.ObjectId(this._id),
      detectorType: detector.type,
      timestamp: { $gt: since },
    };

    const data = await this.sensorReadingModel.find(filterReadSensor).lean();
    return this.filterSensorHistory(data);
  }
}