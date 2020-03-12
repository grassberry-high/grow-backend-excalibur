import { modelOptions, prop } from '@typegoose/typegoose';

class Detector {
  @prop({ required: true })
  label!: string;

  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  unit!: string;
}

enum Tech {
  I2C,
  BLE,
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Sensor {
  @prop({ required: true })
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

  @prop({ required: true })
  detectors!: [Detector];
}