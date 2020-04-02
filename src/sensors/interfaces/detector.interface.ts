  export interface IDetector {
  name?: string;
  lastWrite: Date;
  history: any[];
  type: string;
  shortBuffer: any[];
  currentValue: any;
  lastPush: Date;
}
