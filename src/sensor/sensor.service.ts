import { Injectable } from '@nestjs/common';
import { Sensor } from './sensor.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import Debug from "debug";
const debugSensorBoot = Debug('sensor:boot');
const debugSensorBootVerbose = Debug('sensor:boot:verbose');
import sensorDummies from "./sensor.dummies"


@Injectable()
export class SensorService {
  private _registeredSensors: Sensor[] = [];

  public get registeredSensors(): Sensor[] {
    return this._registeredSensors;
  }

  constructor(
    @InjectModel(Sensor)
    private readonly sensorModel: ReturnModelType<typeof Sensor>
  ) {}

  async getSensorsRaw(): Promise<Sensor[]> {
    return this.sensorModel.find();
  }

  addSensor(newSensor: Sensor): void {
    debugSensorBootVerbose('Adding newSensor to registered sensors', newSensor);
    this.registeredSensors.push(newSensor);
    debugSensorBootVerbose(this.registeredSensors.length);
  };

  seedSensors() {
    return this.sensorModel.insertMany(sensorDummies);
  }

  
  // public get value() : string {
  //   return 
  // }
  


}