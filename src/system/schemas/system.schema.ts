'use strict';
import {Schema} from 'mongoose';

export const SystemSchema = new Schema({
  enabledFeatures: Schema.Types.Mixed,
  version: String,
  region: String,
  timeZone: String,
  units: {
    temperature: String,
  },
  serial: String,
  wifi: String,
  lastConnect: Date,
});
