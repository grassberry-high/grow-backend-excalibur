import { Body, Controller, Post } from '@nestjs/common';
import { UpsertChamberDto } from './dto/chamber-upsert.dto';
import { ChambersService } from './chambers.service';
import { IChamber } from './interfaces/chamber.interface';
import { GetChamberDto } from './dto/chamber-get.dto';

@Controller('chambers')
export class ChambersController {

  constructor(private readonly chambersService: ChambersService) {}

  @Post('/get')
  findAll(@Body() chamberQuery: GetChamberDto): Promise<IChamber[]> {
    return this.chambersService.findAll(chamberQuery.filter, chamberQuery.options);
  }

  @Post()
  async upsert(@Body('chamber') upsertChamberDto: UpsertChamberDto) {
    console.log('upsertChamberDto', upsertChamberDto);
    this.chambersService.create(upsertChamberDto);
  }

}
