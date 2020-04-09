import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { SocketIOMessengerService } from '../socket-io-messenger/socket-io-messenger.service';
import { SocketIOMessengerModule } from '../socket-io-messenger/socket-io-messenger.module';

@Module({
  imports: [SocketIOMessengerModule],
  providers: [LoggerService, SocketIOMessengerService],
  exports: [LoggerService]
})
export class LoggerModule {}
