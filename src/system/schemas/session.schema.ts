import {Schema} from 'mongoose';

export const SystemSchema = new Schema({
  _id: String, // TODO: check really string
  session: String,
  expires: Date,
});
