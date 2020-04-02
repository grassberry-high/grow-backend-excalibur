import 'mongoose';
import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Sensor } from '../sensors/sensors.model';

export enum Unit {
  HOURS= 'hours',
  MINUTES= 'minutes',
  SECONDS= 'seconds'
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class SensorReading {
  @prop({ ref: Sensor, required: true})
  sensor!: Ref<Sensor>;

  @prop({ required: true })
  name!: string;

  @prop({required: true})
  value!: number;

  @prop({required: true})
  detectorType!: string;

  @prop({required: true})
  timestamp!: Date;
}