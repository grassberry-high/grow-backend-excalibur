// TODO: not very DRY
export interface IStrain {
  name: string;
  daysToHarvest: number;
  leafly: string;
}

export interface IChamber {
  name: string;
  cycle: string;
  displays: string[];
  rules: string[];
  strains: IStrain[],
}
