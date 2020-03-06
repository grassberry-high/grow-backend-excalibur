import { Test, TestingModule } from '@nestjs/testing';
import { SocketIOMessengerService } from './socket-io-messenger.service';

describe('SocketIOMessengerService', () => {
  let service: SocketIOMessengerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketIOMessengerService],
    }).compile();

    service = module.get<SocketIOMessengerService>(SocketIOMessengerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
