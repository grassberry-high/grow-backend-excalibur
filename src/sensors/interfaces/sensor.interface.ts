import {Document} from 'mongoose';
import { IDetector } from './detector.interface';
export interface ISensor extends Document{
  address: number;
  sensorModel: string; // TODO this has to be renamed everywhere; before model but incompatible with mongoose model
  technology : string;
  detectors : IDetector[];
}
