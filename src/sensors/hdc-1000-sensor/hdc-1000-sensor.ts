import Sensor from '../sensor';
import debug from 'debug';
import { inspect } from 'util';
import * as moment from 'moment';

const CMD_READ_TEMPERATURE = 0x00; // 2bytes
const CMD_READ_HUMIDITY = 0x01; // 2bytes
const SENSOR_REGISTER = 0x02;
const BOOT_CMD = 0x30; // 0x30(48)  Temperature, Humidity enabled, Resolultion = 14-bits, Heater on

const debugTemp = debug('sensor:temp');
const debugHumidity = debug('sensor:humidity');
import { SystemReadService } from 'src/system/services/system-read.service';
import { Inject } from '@nestjs/common';
import { LoggerService } from 'src/helpers/logger/logger.service';

export class Hdc1000Sensor extends Sensor{
  temperatureMode;
  @Inject()
  private readonly systemReadService: SystemReadService

  async init(sensor: Partial<Sensor>, detectors: string[]) {
    super.init(sensor, detectors)
    console.log('Real hdc1000', sensor._id);
    debugTemp(`Temp/Humdity sensor ${sensor._id}`);
    if (process.env.KALMAN_FILTER) {
      sensor.modes = sensor.modes || {};
      sensor.modes.kalman = JSON.parse(process.env.KALMAN_FILTER); //  {"R":0.1,"Q":0.1}
    }
    
    console.log('val', this.systemReadService);
    
    const system = await this.systemReadService.get({});
    if (system && system.temperature) {
      this.temperatureMode = system.temperature;
    } else {
      this.temperatureMode = 'celsius';
      try {
        await this.boot();
        // this.readSensor();
      } catch (err) {
        throw err;
      }
    }
  }

  async boot() {
    if (this.i2c1 != null) {
      try {
        await this.i2c1.writeByte(this.address, SENSOR_REGISTER, BOOT_CMD);
      } catch (err) {
        console.error('@boot hdc1000 sensor', err);
      }
    } else {
      throw 'I2c not started can\'t boot hdc1000 sensor';
    }
  }

  // --------------------------- Conversions ----------------------------------
  /**
   * Converts raw humidity sensor data to humidity value
   * @return {number}
   */
  static convertHumidity(byte1: number, byte2: number): number {
    let humidity = byte1 * 256 + byte2;
    humidity = (humidity / 65536.0) * 100.0;
    return humidity;
  }

  /**
   * Converts raw temperature sensor data to temperatrue value
   */
  static convertTemp(
    byte1: number,
    byte2: number,
  ): { cTemp: number; fTemp: number } {
    const temp = byte1 * 256 + byte2;
    const cTemp = (temp / 65536.0) * 165.0 - 40;
    const fTemp = cTemp * 1.8 + 32;
    return { cTemp, fTemp };
  }

  // --------------------------- Read ----------------------------------
  /**
   * Read the temperature
   */
  async readTemperature() {
    await this.i2c1.sendByte(this.address, CMD_READ_TEMPERATURE);
    const byte1 = await this.i2c1.receiveByte(this.address);
    const byte2 = await this.i2c1.receiveByte(this.address);
    if (byte1 != null && byte2 != null && (byte1 !== 0 || byte2 !== 0)) {
      const tempFull = Hdc1000Sensor.convertTemp(byte1, byte2);
      let temp;
      if (this.temperatureMode === 'fahrenheit') {
        temp = tempFull.fTemp;
      } else {
        temp = tempFull.cTemp;
      }
      debugTemp(
        `TEMPERATURE: ${inspect(temp)} (adr ${this.address}) ${moment().format(
          'hh:mm DD-MM-YYYY',
        )} ${this.temperatureMode}`,
      );
      return temp;
    }
  }

  /**
   * Read the humidity
   */
  async readHumidity() {
    await this.i2c1.sendByte(this.address, CMD_READ_HUMIDITY);
    const byte1 = await this.i2c1.receiveByte(this.address);
    const byte2 = await this.i2c1.receiveByte(this.address);
    if (byte1 != null && byte2 != null && (byte1 !== 0 || byte2 !== 0)) {
      const humidity = Hdc1000Sensor.convertHumidity(byte1, byte2);
      debugHumidity(
        `HUMIDITY: ${humidity} (adr ${this.address})}  ${moment().format(
          'hh:mm DD-MM-YYYY',
        )}`,
      );
      return humidity;
    }
  }

  /**
   * Read all detectors of the sensor
   */
  async readSensor() {
    if (this.i2c1) {
      // console.log "READING TEMPERATURE/HUMIDITY SENSOR (adr #{self.address})"
      try {
        for (const detector of this.detectors) {
          switch (detector.type) {
            case 'temperature':
              try {
                const temperature = await this.readTemperature();
                if (temperature != null) {
                  return this.processSensorValue(detector, temperature);
                }
              } catch (err) {
                console.error(err);
              } // TODO: choose dependend on user detector
              break;
            case 'humidity':
              try {
                const humidity = await this.readHumidity();
                return this.processSensorValue(detector, humidity);
              } catch (error) {
                console.error(error);
              } // TODO: choose dependend on user detector
              break;
            default:
              throw `Detector type ${detector.type} not implemented`;
          }
        }
      } catch (error) {
        this.loggerService.error('@hdc1000', error);
        setTimeout(() => this.readSensor(), this.sensorReadIntervall);
      }
    } else {
      setTimeout(() => this.readSensor(), this.sensorReadIntervall);
    }
  }
}
