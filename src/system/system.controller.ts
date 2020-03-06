import { Body, Controller, Get, Post } from '@nestjs/common';
import { SystemReadService } from './services/system-read.service';
import { SystemSupportService } from './services/system-support.service';
import { SystemUpdateService } from './services/system-update.service';
import { GetSystemDto } from './dto/system-get.dto';
import { ISystem } from './interfaces/system.interface';

@Controller('system')
export class SystemController {

  constructor(
    private readonly systemReadService: SystemReadService,
    private readonly systemSupportService: SystemSupportService,
    private readonly systemUpdateService: SystemUpdateService
  ) {}

  @Get('/get')
  findAll(@Body() filterQuery: GetSystemDto): Promise<ISystem> {
    return this.systemReadService.get(filterQuery.filter);
  }

  @Get('/getLicenseInformation')
  getLicenseInformation() {
    // TODO: implement
  }


}
