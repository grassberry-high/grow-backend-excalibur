import { Injectable } from '@nestjs/common';
import { Sensor as SensorModel } from './sensors.model';
import Sensor from "../sensors/sensor";
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import debug from 'debug';

import { I2cService } from '../i2c/i2c.service';
import { Mhz16Sensor } from './mhz-16-sensor/mhz-16-sensor';
import { Hdc1000Sensor } from './hdc-1000-sensor/hdc-1000-sensor';
import { ChirpSensor } from './chirp-sensor/chirp-sensor';
import ChirpSensorMock from './chirp-sensor/mocks/chirp-sensor.mock';
import Hdc1000SensorMock from './hdc-1000-sensor/mocks/hdc-1000-sensor.mock';
import Mhz16SensorMock from './mhz-16-sensor/mocks/mhz-16-sensor.mock';

@Injectable()
export class SensorsService {
  debugSensorBoot: debug.Debugger;
  debugSensorBootVerbose: debug.Debugger;
  chirpSensorClass;
  mhz16SensorClass;
  hdc1000SensorClass;

  constructor(
    @InjectModel(SensorModel) private readonly sensorModel: ReturnModelType<typeof SensorModel>,
    private i2cService: I2cService,
    private readonly chirpSensor: ChirpSensor,
    private readonly mhz16Sensor: Mhz16Sensor,
    private readonly hdc1000Sensor: Hdc1000Sensor
  ) {
    // TODO: debug does not work currently
    this.debugSensorBoot = debug('sensor:boot');
    this.debugSensorBootVerbose = debug('sensor:boot:verbose');
    if (process.env.SIMULATION === 'true') {
      this.chirpSensorClass = new ChirpSensorMock();
      this.mhz16SensorClass = new Mhz16SensorMock();
      this.hdc1000SensorClass = new Hdc1000SensorMock();
    } else {
      this.chirpSensorClass = chirpSensor;
      this.mhz16SensorClass = mhz16Sensor;
      this.hdc1000SensorClass = hdc1000Sensor;
    }
  }

  private _registeredSensors: Sensor[] = [];

  public get registeredSensors(): Sensor[] {
    return this._registeredSensors;
  }

  async getSensorsRaw(filterRead?, options?) {
    return this.sensorModel.find(filterRead, options).lean();
  }

  addSensor(newSensor: Sensor): void {
    this.debugSensorBootVerbose('Adding newSensor to registered sensors', newSensor);
    this.registeredSensors.push(newSensor);
    this.debugSensorBootVerbose(this.registeredSensors.length);
  }

  async bootSensors(options) {
    const filterRead = options.filterRead || {};
    const sensorsFound: SensorModel[] = await this.sensorModel.find(filterRead).lean();
    if (options.additive !== true) {
      this._registeredSensors = [];
    }
    this.debugSensorBoot('sensorsFound', sensorsFound);
    sensorsFound.forEach(async (sensor) => {
      const sensorIndex = this.registeredSensors.findIndex(se => se.address == sensor.address)
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

  async bootI2CSensor(sensor: SensorModel) {
    this.debugSensorBootVerbose('i2c sensor:', sensor);
    const sensorArg = 
    {
      _id: sensor._id.toHexString(),
      model: sensor.model,
      technology: sensor.technology,
      address: sensor.address
    }

    const detectorNames = sensor.detectors.map(d => d.name)

    switch (sensor.model) {
      case 'chirp':
        console.log("NEW CHIRPS");
        this.chirpSensorClass.initChirp(sensorArg, detectorNames)
        this.addSensor(this.chirpSensorClass);
        break;
      case 'hdc1000':
        await this.hdc1000SensorClass.init(sensorArg, detectorNames);
        this.addSensor(this.hdc1000SensorClass);
        break;
      case 'mhz16':
        this.mhz16SensorClass.initMhz16(sensorArg, detectorNames);
        this.addSensor(this.mhz16SensorClass);
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

  // TODO: rename to getRegisteredSensors
  getSensors() {return this.registeredSensors};

  // TODO: rename to isSensorRegistered
  sensorRegistered(address) {
    return !!~this.registeredSensors.find(se => se.address == address);
  }

  // broadcastSensors() {
  //   this.registeredSensors.forEach((sensor) => sensor.broadcastSensorHistory());
  // }

  
  // async updateSensorTimeUnit(sensorId, newTimeUnit, options, callback) {
  //   const errors = [];
  //   if (sensorId === null) {
  //     errors.push(new Error('SensorId is required for this operation'));
  //   }
  //   if (!newTimeUnit) {
  //     errors.push(new Error('Time unit is required for this operation'));
  //   }
  //   if (errors.length > 0) {
  //     throw(errors);
  //   }
  //   const sensor = this.registeredSensors.filter((sensor) => sensor._id.toString() === sensorId);
  //   if (sensor.length === 1) {
  //     await sensor[0].changeSensorTimeUnit(newTimeUnit);
  //   } else {
  //     throw('Could not identify sensor');
  //   }
  // }

  // TODO: check where sensorSeeds came from, probably imported
  async seedSensors(sensorSeeds) {
    const count = await this.sensorModel.countDocuments({});
    if (count > 0) {
        return;
    }
    this.sensorModel.insertMany(sensorSeeds);
  }
}
