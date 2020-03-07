import SensorMock from '../../mocks/sensor.mock';

export default class Mhz16SensorMock extends SensorMock{
  constructor(options) {
    super(options);
  }

  async initMhz16(options) {
    console.log('My name is', options.name);
  }
}
