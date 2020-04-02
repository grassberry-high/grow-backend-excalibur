import { Injectable } from '@nestjs/common';
const BUS = 1;

import {inspect}from  'util';
import debug from 'debug';

const debugI2c = debug('busI2c');
const debugI2cVerbose = debug('busI2c:verbose');

import {isEqual, difference} from 'lodash';
import * as os from 'os';

// import * as I2CMod from "i2c-bus";

let i2c : I2cServiceMock;
let i2cBus;
let i2CMod;
import {I2cServiceMock, MockBus} from './mocks/i2c.mock';

if (process.env.USE_I2C_MOCK === 'true') {
  console.log("ismock"); 
  debugI2c('Not using I2C: ENV USE_I2C_MOCK set', os.arch(), 'i2c', i2c);
  i2c = new I2cServiceMock();
} else if (os.arch() !== 'arm') {
  console.log("ismock");
  debugI2c('Not using I2C', os.arch());1
  i2c = new I2cServiceMock();
} else { // arm === raspberrypi
  i2CMod = require("i2c-bus").I2CMod
  debugI2c('Using I2C', os.arch(), inspect(i2c));
}

@Injectable()
export class I2cService {
  activeDevices = [];

  /**
   * Boot I2C, scan for devices and watch for new/lost devices
   */
  async bootI2C() {
    debugI2c('Booting I2C');
    if (!i2c) {
      i2cBus = await i2CMod.openPromisified(BUS)
    }
    else
      i2cBus = await i2c.open(BUS);

    await this.scan();
  }

  /**
   * check for new/lost devices
   */
  async checkDifference() {
    let activeDevicesTemp = this.activeDevices;
    await this.scan();
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
      return  {differenceLost, differenceAdded};
    } else {
      return null;  
    }
  }

  /**
   * Scan for devices
   */
  async scan() {
    if (i2cBus) {
      try {
        const devices = await i2cBus.scan();  
        debugI2cVerbose(`\n${inspect(devices)}`);
        this.activeDevices = devices.sort();
      }  
       catch (error) {
        if (this.activeDevices.length === 0) {
          debugI2c(`\n\n====================\nSCAN\n=======================\n${error}`);
          }
        throw error;
      }
    } else {
      throw 'I2C not booted (#1)';
    }
  }

  adressInActiveDevices(address: number) {
    return this.activeDevices.indexOf(address) !== -1;
  }

  getI2cBus() { return i2cBus }

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
  }

  // ============================== REPROGRAM WATERSENSOR =========================
  // Info via I2c Tools
  // i2cdetect 1 #detects I2c Devices on bus 1
  // i2cset -y 1 0x20 0x01 0x21 #wirtes new address to water sensor
  // i2cset -y 1 0x20 0x06 #resets the water sensor
  async updateI2CAddress(sensorType: string, oldAddress: number, newAddress: number) {
    if ((i2cBus == null)) {
      throw 'I2C not active';
    }
    if (sensorType === 'waterSensor') {
      const watersensorRegister = 0x01;
      debugI2c(`Setting waterSensor from ${oldAddress} (${oldAddress.toString(16)}) to ${newAddress} (${newAddress.toString(16)})`);
      await i2cBus.writeByte(oldAddress, watersensorRegister, newAddress);
      const commandReset = 0x06;
      debugI2c('Resetting waterSensor');
      // i2c1.writeByte oldAddress, watersensorRegister, commandReset, next
      await i2cBus.sendByte(oldAddress, commandReset);
    } else {
      throw 'Only allowed for sensor type water sensor';
    }
  }

}
