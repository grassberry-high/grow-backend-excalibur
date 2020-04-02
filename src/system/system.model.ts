import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export  class System {
  @prop({required: true})
  validTill: Date;
}
