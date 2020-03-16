import { Module } from '@nestjs/common';
import { BsonToJsonService } from './bson-to-json/bson-to-json.service';
import { ComparisonService } from './comparison/comparison.service';
import { LoggerModule } from './logger/logger.module';
import { SocketIOMessengerModule } from './socket-io-messenger/socket-io-messenger.module';

@Module({
  imports: [LoggerModule, SocketIOMessengerModule],
  providers: [BsonToJsonService, ComparisonService],
  exports: [LoggerModule],
})
export class HelpersModule {}
