import { modelOptions, prop, arrayProp } from '@typegoose/typegoose';
export class Detector {
  @prop({ required: true })
  label!: string;

  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  unit!: string;
}

export enum Tech {
  I2C = 'i2c',
  BLE = 'ble',
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Sensor {
  @prop({ required: true, enum: Tech, lowercase: true })
  technology!: Tech; // I2C or BLE

  @prop({ required: true })
  model!: string;

  @prop({
    unique: true,
    sparse: true,
    required: [
      function() {
        return this.technology == Tech.I2C;
      },
      'I2C address is required',
    ],
  })
  address?: number; // I2C & BLE sensor

  @prop({
    unique: true,
    sparse: true,
    required: [
      function() {
        return this.technology == Tech.BLE;
      },
      'UUID is required',
    ],
  })
  uuid?: string; // BLE sensor

  @arrayProp({ required: true, items: Detector })
  detectors!: Detector[];
}
