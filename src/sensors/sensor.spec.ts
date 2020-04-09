import Sensor from './sensor';
import { TestingModule, Test } from '@nestjs/testing';
import sensorDummies from './sensor.dummies';
import sensorDataDummies from './sensor-data.dummies';
import { getModelToken } from 'nestjs-typegoose';
import { I2cService } from '../i2c/i2c.service';
import { sortBy } from 'lodash';
import * as moment from "moment";

describe('Sensor', () => {
  const fakeSensorInstance = [
    '588a427d617fff11d79b3049',
    'hdc1000',
    'i2c',
    ['temperature', 'humidity'],
  ];

  let sensor: Sensor;

  class SensorReadingMock {
    async find() {
      return sensorDataDummies;
    }
  }

  class SensorModelMock {
    async find() {
      return sensorDummies;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Sensor,
        I2cService,
        {
          provide: getModelToken('Sensor'),
          useClass: SensorModelMock,
        },
        {
          provide: getModelToken('SensorReading'),
          useClass: SensorReadingMock,
        },
      ],
    }).compile();

    sensor = module.get<Sensor>(Sensor);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    await sensor.init(...fakeSensorInstance);
  });
  it('should be defined', () => {
    expect(sensor).toBeDefined();
  });

  describe('test filterSensorHistory', () => {
    it('filterSensorHistory should return x and y values', () => {
      const filteredData = sensor.filterSensorHistory(sensorDataDummies);
      filteredData.forEach(element => {
        expect(element).toHaveProperty('y', expect.any(Number));
        expect(element).toHaveProperty('x', expect.any(Date));
      });
    });

    it('test with array of length 1', () => {
      const lastestArr = [sortBy(sensorDataDummies, 'timestamp').reverse()[0]];
      console.log(lastestArr);
      
      const filteredElem = sensor.filterSensorHistory(lastestArr)[0];
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      // expect(filteredElem).toHaveProperty('x', moment(lastestArr[0].timestamp).toDate());
      // expect(filteredElem).toHaveProperty('y', lastestArr[0].value);
    });
  });
});
