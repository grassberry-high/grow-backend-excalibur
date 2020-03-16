export interface IDetector {
  lastWrite: Date;
  history: any[];
  shortBuffer: any[];
  currentValue: any;
}
