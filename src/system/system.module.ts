import { Module } from '@nestjs/common';
import { SystemUpdateService } from './services/system-update.service';
import { SystemReadService } from './services/system-read.service';
import { SystemSupportService } from './services/system-support.service';
import { SystemController } from './system.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemSchema } from './schemas/system.schema';
import { ApiModule } from './api/api.module';
import { ShellService } from './shell/shell.service';
import { HelpersModule } from '../helpers/helpers.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'System', schema: SystemSchema }]), ApiModule, HelpersModule],
  providers: [SystemUpdateService, SystemReadService, SystemSupportService, ShellService],
  controllers: [SystemController],
  exports: [SystemReadService]
})
export class SystemModule {}
