import { Test, TestingModule } from '@nestjs/testing';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

describe('Sensor Controller', () => {
  let controller: SensorController;

  class SensorServiceMock {
    private getSensorsRaw() {
      return {};
    }

    private addSensor(): void {
      return;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorController],
      providers: [{ provide: SensorService, useClass: SensorServiceMock }],
    }).compile();

    controller = module.get<SensorController>(SensorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
