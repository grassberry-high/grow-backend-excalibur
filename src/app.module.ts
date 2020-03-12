import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChambersModule } from './chambers/chambers.module';
import {TypegooseModule} from "nestjs-typegoose";
import { SensorModule } from './sensor/sensor.module';

@Module({
  imports: [
    ChambersModule,
    TypegooseModule.forRoot(process.env.MONGO_URI || "mongodb://localhost:27017/test", { useNewUrlParser: true }),
    SensorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
