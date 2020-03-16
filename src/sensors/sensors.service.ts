import { Inject, Injectable } from '@nestjs/common';
import debug from 'debug';

import {findIndex} from 'lodash';
import {Model} from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { ISensor } from './interfaces/sensor.interface';
import { I2cService } from '../i2c/i2c.service';
import { Mhz16Sensor } from './mhz-16-sensor/mhz-16-sensor';
import { Hdc1000Sensor } from './hdc-1000-sensor/hdc-1000-sensor';
import { ChirpSensor } from './chirp-sensor/chirp-sensor';

@Injectable()
export class SensorsService {
  debugSensorBoot: any;
  debugSensorBootVerbose: any;
  registeredSensors: any[];

  constructor(
    @InjectModel('Sensor') private readonly sensorModel: Model<ISensor>,
    private i2cService: I2cService,
    @Inject('ChirpSensor') private chirpSensorClass: any,
    @Inject('Mhz16Sensor') private mhz16SensorClass: any,
    @Inject('Hdc1000Sensor') private hdc1000SensorClass: any
  ) {
    // TODO: debug does not work currently
    this.debugSensorBoot = debug('sensor:boot');
    this.debugSensorBootVerbose = debug('sensor:boot:verbose');
    // this.debugSensorBoot.enabled = true;
    // this.debugSensorBootVerbose.enabled = true;
  }


  async bootSensors(options) {
    const filterRead = options.filterRead || {};
    const sensorsFound = await this.sensorModel.find(filterRead).lean();
    if (options.additive !== true) {
      this.registeredSensors = [];
    }
    this.debugSensorBoot('sensorsFound', sensorsFound);
    sensorsFound.forEach(async (sensor) => {
      const sensorIndex = findIndex(this.registeredSensors, { 'address': sensor.address });
      if (!!~sensorIndex) {
        return;
      } else {
        this.debugSensorBoot(`Sensor ${sensor.address} ${sensor.model} is active: ${this.i2cService.adressInActiveDevices(sensor.address)}`);
        this.debugSensorBootVerbose('sensorIndex', sensorIndex, this.registeredSensors);
        if ((sensor.technology === 'i2c') && this.i2cService.adressInActiveDevices(sensor.address)) {
          this.bootI2CSensor(sensor)
        } else if (sensor.technology === 'ble') {
          this.bootBLESensor(sensor)
        } else {
          this.debugSensorBoot('Sensor technology', sensor.technology, 'is not handled.');
        }
      }
    });
  }

  async bootI2CSensor(sensor) {
    this.debugSensorBootVerbose('i2c sensor:', sensor);
    switch (sensor.model) {
      case 'chirp':
        console.log("NEW CHIRPS");
        const chirpSensor = new this.chirpSensorClass(sensor);
        await chirpSensor.initChirp(sensor);
        this.addSensor(chirpSensor);
        break;
      case 'hdc1000':
        const hdc1000Sensor = new this.hdc1000SensorClass(sensor);
        await hdc1000Sensor.initHdc1000(sensor);
        this.addSensor(hdc1000Sensor);
        break;
      case 'mhz16':
        const mhz16Sensor = new this.mhz16SensorClass(sensor);
        await mhz16Sensor.initMhz16(sensor);
        this.addSensor(mhz16Sensor);
        break;
      default:
        this.debugSensorBoot('Sensor model:', sensor.model, 'is not handled.');
        return;
    }
  }

  async bootBLESensor(sensor) {
    // TODO: problem with xpc-connection
    // switch (sensor.model) {
    //   case 'sensorTag':
    //     new SensorTagSensor(sensor, function(err, newSensor){
    //       if (err) { return next(err); }
    //       addSensor(newSensor, next);
    //     });
    //   default:
    //     return next();
    // }
  }

  addSensor(newSensor) {
    this.debugSensorBootVerbose('Adding newSensor to registered sensors', newSensor, newSensor.length);
    this.registeredSensors.push(newSensor);
    this.debugSensorBootVerbose(this.registeredSensors.length);
  }

  async getSensorsRaw(filterRead, options) {
    return this.sensorModel.find(filterRead, options).lean();
  }

  // TODO: rename to getRegisteredSensors
  getSensors() {return this.registeredSensors};

  // TODO: rename to isSensorRegistered
  sensorRegistered(address) {
    return !!~findIndex(this.registeredSensors, {'address': address});
  }

  broadcastSensors() {
    this.registeredSensors.forEach((sensor) => sensor.broadcastSensorHistory());
  }

  async updateSensorTimeUnit(sensorId, newTimeUnit, options, callback) {
    const errors = [];
    if (sensorId === null) {
      errors.push(new Error('SensorId is required for this operation'));
    }
    if (!newTimeUnit) {
      errors.push(new Error('Time unit is required for this operation'));
    }
    if (errors.length > 0) {
      throw(errors);
    }
    const sensor = this.registeredSensors.filter((sensor) => sensor._id.toString() === sensorId);
    if (sensor.length === 1) {
      await sensor[0].changeSensorTimeUnit(newTimeUnit);
    } else {
      throw('Could not identify sensor');
    }
  }

  // TODO: check where sensorSeeds came from, probably imported
  async seedSensors(sensorSeeds) {
    const count = await this.sensorModel.countDocuments({});
    if (count > 0) {
        return;
    }
    this.sensorModel.insertMany(sensorSeeds);
  }
}
