import { Test, TestingModule } from '@nestjs/testing';
import { SensorService } from './sensor.service';
import { Sensor, Tech } from './sensor.model';
import sensorDummies from './sensor.dummies';
import { getModelToken } from 'nestjs-typegoose';

describe('SensorService', () => {
  let service: SensorService;
  const newSensor: Sensor = {
    technology: Tech.I2C,
    address: 64,
    model: 'hdc1000',
    detectors: [
      {
        label: 'Temperature (Right)',
        name: 'Temperature (Right)',
        unit: 'C',
      },
      {
        label: 'Humidity (Right)',
        name: 'Humidity (Right)',
        unit: 'RF',
      },
    ],
  };

  class SensorMock {
    async find() {
      return sensorDummies;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorService,
        {
          provide: getModelToken('Sensor'),
          useClass: SensorMock,
        },
      ],
    }).compile();

    service = module.get<SensorService>(SensorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSensor should add a new sensor to the array of sensors', () => {
    service.addSensor(newSensor);
    const sensors = service.registeredSensors;
    expect(sensors).toContain(newSensor);
    expect(sensors).toHaveLength(1);
  });

  it('getSensorsRaw return raw values of sensors', async () => {
    const sensors = await service.getSensorsRaw();
    expect(sensors).toEqual(sensorDummies);
  });
});
