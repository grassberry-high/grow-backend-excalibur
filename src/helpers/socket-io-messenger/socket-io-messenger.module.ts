import { Module } from '@nestjs/common';
import { SocketIOMessengerService } from './socket-io-messenger.service';

@Module({
  providers: [SocketIOMessengerService]
})
export class SocketIOMessengerModule {}
