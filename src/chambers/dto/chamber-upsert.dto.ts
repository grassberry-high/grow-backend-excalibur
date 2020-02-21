export class StrainDto {
  name: string;
  daysToHarvest: number;
  leafly: string;
}

export class UpsertChamberDto {
  name: string;
  cycle: string;
  displays: string[];
  rules: string[];
  strains: StrainDto[];
}
