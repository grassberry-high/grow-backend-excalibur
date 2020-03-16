'use strict';
import * as mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;
import * as  deepPopulateModule from 'mongoose-deep-populate';

const deepPopulate = deepPopulateModule(mongoose);

export const StrainSchema = {
  name: String,
  daysToHarvest: Number,
  leafly: String,
};

export const ChamberSchema = new mongoose.Schema({
  name: String,
  cycle: String,
  displays: [{
    type: ObjectId,
    ref: 'Sensor',
  }],
  rules: [{
    type: ObjectId,
    ref: 'Rule',
    validate: {
      validator(value) {
        return (value != null);
      },
      message: '{VALUE} is not valid.',
    },
  }],
  strains: [StrainSchema],
});

// ChamberSchema.plugin(deepPopulate, {});
//
// let ChamberModel;
// try {
//   ChamberModel = mongoose.model('Chamber');
// } catch (err) {
//   ChamberModel = mongoose.model('Chamber', ChamberSchema);
// }
