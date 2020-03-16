import { Injectable } from '@nestjs/common';
const BUS = 1;

import {inspect}from  'util';
import debug from 'debug';

const debugI2c = debug('busI2c');
const debugI2cVerbose = debug('busI2c:verbose');

import async from 'async';
import {isEqual, difference} from 'lodash';
import * as os from 'os';

let i2c;
let i2c1;
import {I2cServiceMock} from './mocks/i2c.mock';

if (process.env.USE_I2C_MOCK === 'true') {
  debugI2c('Not using I2C: ENV USE_I2C_MOCK set', os.arch(), 'i2c', i2c);
  i2c = new I2cServiceMock();
} else if (os.arch() !== 'arm') {
  debugI2c('Not using I2C', os.arch());
  i2c = new I2cServiceMock();
} else { // arm === raspberrypi
  i2c = require('i2c-bus');
  debugI2c('Using I2C', os.arch(), inspect(i2c));
}

@Injectable()
export class I2cService {
  activeDevices = [];

  /**
   * Boot I2C, scan for devices and watch for new/lost devices
   */
  bootI2C(callback: Function) {
    debugI2c('Booting I2C');
    async.series([
      (next) => i2c1 = i2c.open(BUS, next),
      (next) => this.scan(next),
    ], callback);
  };

  /**
   * check for new/lost devices
   */
  checkDifference(callback: Function) {
    let activeDevicesTemp = this.activeDevices;
    this.scan((err) => {
      if (err) {
        console.error(err);
      }
      if (!isEqual(activeDevicesTemp, this.activeDevices)) {
        const differenceLost = difference(activeDevicesTemp, this.activeDevices);
        const differenceAdded = difference(this.activeDevices, activeDevicesTemp);
        if (differenceLost.length > 0) {
          debugI2c(`LOST ${differenceLost}`);
        }
        if (differenceAdded.length > 0) {
          debugI2c(`ADDED ${differenceAdded}`);
        }
        activeDevicesTemp = this.activeDevices;
        return callback(null, {differenceLost, differenceAdded});
      } else {
        return callback(null);
      }
    });
  };

  /**
   * Scan for devices
   */
  scan(callback: Function) {
    if (i2c1) {
      i2c1.scan((err, devices) => {
        if (this.activeDevices.length === 0) {
          debugI2c(`\n\n====================\nSCAN\n=======================\n${err}`);
        } else {
          debugI2cVerbose(`\n${inspect(devices)}`);
        }
        this.activeDevices = devices.sort();
        return callback(err, devices);
      });
    } else {
      return callback('I2C not booted (#1)');
    }
  };

  adressInActiveDevices(address: string) {
    return this.activeDevices.indexOf(address) !== -1;
  };

  getI2cBus() { return i2c1 };

  // TODO: remove this dep. rather query sensors and relays in sensor and relay module
  getActiveDevices (callback: Function) {
    // if (this.activeDevices.length === 0) {
    //   return callback(null, []);
    // }
    // const filterRead = {address: {$in: this.activeDevices}};
    // let activeDevicesDetail = [];
    // async.parallel({
    //     relays(next) {
    //       if (this.activeDevices.indexOf(0x20) !== -1) {
    //         activeDevicesDetail = activeDevicesDetail.concat([{
    //           type: 'relay',
    //           address: 0x20,
    //           name: 'Relay Controller',
    //         }]);
    //       }
    //       return next();
    //     },
    //     sensors(next) {
    //       this.sensorModel.find(filterRead).lean().exec((err, sensors) => {
    //         if (err) {
    //           return next(err);
    //         }
    //         sensors = sensors.map((sensor) => {
    //           sensor.type = 'sensor';
    //           return sensor;
    //         });
    //         activeDevicesDetail = activeDevicesDetail.concat(sensors);
    //         return next();
    //       });
    //     },
    //   },
    //   (err) => {
    //     if (err) {
    //       return callback(err);
    //     }
    //     return callback(null, activeDevicesDetail);
    //   });
  };


  // ============================== REPROGRAM WATERSENSOR =========================
  // Info via I2c Tools
  // i2cdetect 1 #detects I2c Devices on bus 1
  // i2cset -y 1 0x20 0x01 0x21 #wirtes new address to water sensor
  // i2cset -y 1 0x20 0x06 #resets the water sensor
  updateI2CAddress(sensorType: string, oldAddress: number, newAddress: number, callback: Function) {
    if ((i2c1 == null)) {
      return callback('I2C not active');
    }
    if (sensorType === 'waterSensor') {
      const watersensorRegister = 0x01;
      async.series([
        (next) => {
          debugI2c(`Setting waterSensor from ${oldAddress} (${oldAddress.toString(16)}) to ${newAddress} (${newAddress.toString(16)})`);
          i2c1.writeByte(oldAddress, watersensorRegister, newAddress, next);
        },
        (next) => {
          const commandReset = 0x06;
          debugI2c('Resetting waterSensor');
          // i2c1.writeByte oldAddress, watersensorRegister, commandReset, next
          i2c1.sendByte(oldAddress, commandReset, next);
        },
      ], (err) => callback(err));
    } else {
      return callback('Only allowed for sensor type water sensor');
    }
  };

}
