import { prop, arrayProp, modelOptions } from '@typegoose/typegoose';
import { Sensor } from 'src/sensors/sensors.model';

export class Strain {
  @prop({required: true})
  name!: string;

  @prop({required: true})
  daysToHarvest!: number;

  @prop({required: true})
  leafly!: string;
};

// @plugin(deepPopulate)
@modelOptions({ schemaOptions: { timestamps: true } })
export class Chamber {
  
  @prop({required: true})
  name!: string;

  @prop({required: true})
  cycle: string;
  
  @arrayProp({required: true, items: Sensor})
  displays!: Sensor[]
  
  // @arrayProp({required: true, validate: {
  //   validator: value => value != null,
  //   message: '{VALUE} is not valid.'
  // })
  // rules: Rule[];
  //   type: ObjectId,
  //   ref: 'Rule',
  //   validate: {
  //     validator(value) {
  //       return (value != null);
  //     },
  //     message: '{VALUE} is not valid.',
  //   },
  // }],
  
  
  // strains: [StrainSchema],
}

// ChamberSchema.plugin(deepPopulate, {});
//
// let ChamberModel;
// try {
//   ChamberModel = mongoose.model('Chamber');
// } catch (err) {
//   ChamberModel = mongoose.model('Chamber', ChamberSchema);
// }
