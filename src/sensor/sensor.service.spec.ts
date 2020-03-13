import { Test, TestingModule } from '@nestjs/testing';
import { SensorService } from './sensor.service';
import { Sensor, Tech } from './sensor.model';
import sensorDummies from './sensor.dummies';
import { getModelToken } from 'nestjs-typegoose';


class SensorMock {
  private find() {
    return sensorDummies;
  }
}

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

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorService,
        {
          provide: getModelToken('Sensor'),
          useValue: Sensor,
        },
        {
          provide: Sensor,
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

  it('getSensorsRaw return raw values of sensors', () => {
    const sensors = service.getSensorsRaw();
    expect(sensors).toEqual(sensorDummies);
  });
});
