import { Module } from '@nestjs/common';
import { SystemUpdateService } from './services/system-update.service';
import { SystemReadService } from './services/system-read.service';
import { SystemSupportService } from './services/system-support.service';
import { SystemController } from './system.controller';
import { ApiModule } from './api/api.module';
import { ShellService } from './shell/shell.service';
import { HelpersModule } from '../helpers/helpers.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { System } from './system.model';

@Module({
  imports: [TypegooseModule.forFeature([System]), ApiModule, HelpersModule],
  providers: [SystemUpdateService, SystemReadService, SystemSupportService, ShellService],
  controllers: [SystemController],
  exports: [SystemReadService]
})
export class SystemModule {}
