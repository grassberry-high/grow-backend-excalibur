import SensorMock from '../../mocks/sensor.mock';

export default class Hdc1000SensorMock extends SensorMock{
  constructor(options) {
    super(options);
  }

  async initHdc1000(options) {
    console.log('Mock hdc1000', options.name);
  }
}
