import Sensor from '../sensor';
import debug from "debug";

const debugCO2 = debug('sensor:co2');
const CMD_GET_SENSOR = [ 0xff, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79]
const CMD_CALIBRATE = [ 0xff, 0x87, 0x87, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf2 ]

const CMD_MEASURE = Buffer.from([0xff, 0x01, 0x9c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x63]);
const IOCONTROL = 0x0e << 3;
const FCR = 0x02 << 3;
const LCR = 0x03 << 3;
const DLL = 0x00 << 3;
const DLH = 0x01 << 3;
const THR = 0x00 << 3;
const RHR = 0x00 << 3;
const TxLVL = 0x08 << 3;
const RxLVL = 0x09 << 3;

import {inspect} from 'util';
import * as moment from 'moment';
import { Inject } from '@nestjs/common';
import { LoggerService } from 'src/helpers/logger/logger.service';

/**
 * MHZ16 is a CO2 sensor.
 */
export class Mhz16Sensor extends Sensor{
  // constructor(options) {
  //   super(options);
  // }

  initMhz16(sensor: Partial<Sensor>, detectors: string[]) {
    super.init(sensor,detectors);
    console.log('My name is', sensor._id);
    debugCO2(`CO2 sensor ${sensor._id}`);
    if (process.env.KALMAN_FILTER) {
      sensor.modes = sensor.modes || {};
      sensor.modes.kalman = JSON.parse(process.env.KALMAN_FILTER); // {"R":0.1,"Q":0.1}
    }
  }

  /**
   * Boots the sensor
   */
  boot() {
    if (this.i2c1) {
      const promises = [];

      try {
        setTimeout(() => {
          try {
            this.i2c1.writeByte(this.address, IOCONTROL, 0x08)
          } catch (error) {
              if (error && error.code !== "EIO")
                throw error;
          }
       }, 100); 
  
       setTimeout(async () => await this.i2c1.writeByte(this.address, FCR, 0x07), 100);
       setTimeout(async () => await this.i2c1.writeByte(this.address, LCR, 0x83), 100);
       setTimeout(async () => await this.i2c1.writeByte(this.address, DLL, 0x60), 100);
       setTimeout(async () => await this.i2c1.writeByte(this.address, DLH, 0x00), 100);
       setTimeout(async () => await this.i2c1.writeByte(this.address, LCR, 0x03), 100);
  
      } catch (error) {
        if (error) {
          console.error('CO2 BOOT ERROR', error, error.stack, inspect(error));
        }
        throw error;
      }
    } else {
        throw 'I2c not started can\'t boot humidity sensor';
    }
  }

  // --------------------------- Conversions ----------------------------------
  /**
   * read co2 value
   * @param {*} response - raw co2 value
   * @return {number} ppm - co2 as parts per million
   */
  static parse(response: number[]): number {
    if (response.length !== 9) {
      return null;
    }
    const checksum = response.reduce(((previousValue, currentValue) => previousValue + currentValue), 0);

    if (!((response[0] === 0xff) && (response[1] === 0x9c) && ((checksum % 256) === 0xff))) {
      return null;
    }

    return (response[2] << 24) + (response[3] << 16) + (response[4] << 8) + response[5]; // ppm
  }

  /**
   * read co2 value
   */
  async readCO2() {
    await this.i2c1.writeByte(this.address, FCR, 0x07);
    const response = await this.i2c1.readByte(this.address, TxLVL);
    if (response < CMD_MEASURE.length) {
      throw 'TxLVL length < cmd length';
    }
    await this.i2c1.writeI2cBlock(this.address, THR, CMD_MEASURE.length, CMD_MEASURE) // writeI2cBlock: err, bytesWritten, buffer
    
    let sensorData = Buffer.alloc(0);
    let left = 9;
    let timeoutCalled = false;
    const timeout = setTimeout(() => {
          timeoutCalled = true; // TODO: check if timeout._called is still a solution
          throw 'Operation timed out';
        }, 9000);

        while(left > 0) {
          try {
          let rxLevel = await this.i2c1.readByte(this.address, RxLVL)
          if (rxLevel > left) {
            rxLevel = left;
          }
          left = left - rxLevel;

          if (rxLevel === 0) {
            return setTimeout(() => console.log("waiting..."))
              
            } else {
              const receivedData = Buffer.alloc(rxLevel);
                await this.i2c1.readI2cBlock(this.address, RHR, rxLevel, receivedData);
                sensorData = Buffer.concat([sensorData, receivedData]);
            }
          } catch(e) {
            if (e) {
              clearTimeout(timeout)
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              //@ts-ignore
              if (timeoutCalled !== true) {
                throw e
              }
            }
          }
        }

            if (sensorData != null) {
              // console.log "sensorData", sensorData.toString('hex')
              const newSensorData = sensorData.toJSON().data;
              const ppm = Mhz16Sensor.parse(newSensorData);
              debugCO2(`CO2: PPM  ${ppm} (adr ${this.address}) ${moment().format('hh:mm DD-MM-YYYY')}`);
              return ppm;
            }
          }
  /**
   * read and process co2 value
   */
  async readSensor() {
    if (this.i2c1) {
      try {
      for (const detector of this.detectors) {
        if (detector.type === 'co2') {
          let co2;
          try {
            co2 = await this.readCO2()
          } catch (error) {
              console.error('CO2 READ ERROR', error);
            
            } finally {
              return this.processSensorValue(detector, co2);
            }
          }
          else {
            throw 'Detector type not implemented';
          }
        } 
      } catch(err) {
        if (err) {
          this.loggerService.error('CO2 err', err);
          setTimeout(() => this.readSensor(), this.sensorReadIntervall);
        }
      } 
    }else {
        setTimeout(this.readSensor,this.sensorReadIntervall)
      }
  }
}