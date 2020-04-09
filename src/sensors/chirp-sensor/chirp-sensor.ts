import debug from 'debug';
import Sensor from '../sensor';
import * as moment from "moment";

const CMD_READ_WATER_LEVEL = 0x00; // 2bytes
const STATUS_DRY = 0;
const WATERLEVELS = ['Dry', 'Moist', 'Wet'];

/**
 * Chirp is a water level sensor.
 */
export class ChirpSensor extends Sensor {
  debugSensorChrip = debug("sensor:Water")
  lastWaterLevel: number;
  startWet: moment.Moment;
  wetTimeSpan: number;

  initChirp(sensor: Partial<Sensor>, detectors: string[]) {
    this.debugSensorChrip(`Water sensor ${sensor._id}`);
    super.init(sensor,detectors);
    this.readSensor();
  }

  /**
   * Translate water level to text
   * @return {string} waterLevel
   */
  static translateToHuman(waterLevel: number): string {
    waterLevel = Math.round(waterLevel);
    if ((waterLevel == null) || (WATERLEVELS[waterLevel - 1] == null)) {
      return 'No valid waterlevel';
    }
    return WATERLEVELS[waterLevel - 1];
  }

  /**
   * Measures how long the soil stays wet
   */
  setWetTimeSpan(waterLevel: number) { // measures the time the soil stays moist/wet
    if (this.lastWaterLevel !== waterLevel) {
      if (waterLevel > STATUS_DRY) {
        this.startWet = moment();
      } else if ((waterLevel === STATUS_DRY) && (this.startWet != null)) {
        this.wetTimeSpan = moment().diff(this.startWet, 'seconds');
      }
      this.lastWaterLevel = waterLevel;
    }
  }

  /**
   * Read the chirp water sensor
   */
  async readSensor() {
    if (this.i2c1 != null) {
      const waterLevel = await this.i2c1.readByte(this.address, CMD_READ_WATER_LEVEL);
      this.debugSensorChrip(`WATERLEVEL: ${waterLevel} ${ChirpSensor.translateToHuman(waterLevel)} ${moment().format('hh:mm DD-MM-YYYY')}`);
      this.setWetTimeSpan(waterLevel);
      this.processSensorValue(this.detectors[0], waterLevel);
      setTimeout(() => this.readSensor(), this.sensorReadIntervall);
    } else {
      setTimeout(() => this.readSensor(), this.sensorReadIntervall);
    }
  }
}