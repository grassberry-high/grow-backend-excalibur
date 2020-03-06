import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { SocketIOMessengerService } from '../socket-io-messenger/socket-io-messenger.service';

@Module({
  providers: [LoggerService, SocketIOMessengerService],
  exports: [LoggerService]
})
export class LoggerModule {}
