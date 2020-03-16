// TODO: not very DRY
import { Document } from 'mongoose';

export interface IStrain {
  name: string;
  daysToHarvest: number;
  leafly: string;
}

export interface IChamber extends Document {
  name: string;
  cycle: string;
  displays: string[];
  rules: string[];
  strains: IStrain[],
}
