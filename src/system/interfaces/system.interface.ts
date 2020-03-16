import { Document } from 'mongoose';

export interface ISystem extends Document {
  validTill: Date;
}
