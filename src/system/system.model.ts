import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export  class System {
  @prop({required: true})
  validTill!: Date;

  @prop({mixed: true})
  enabledFeatures!: any;

  @prop({required: true})
  version!: string;

  @prop({required: true})
  region!: string;
  
  @prop({required: true})
  timeZone!: string;

  @prop({required: true})
  temperature!: string;
  
  @prop({required: true})
  serial!: string;

  @prop({required: true})
  wifi: string;

  @prop({required: true})
  lastConnect: Date;
}