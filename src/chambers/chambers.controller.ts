import { Body, Controller, Post, Get } from '@nestjs/common';
import { UpsertChamberDto } from './dto/chamber-upsert.dto';
import { ChambersService } from './chambers.service';
import { IChamber } from './interfaces/chamber.interface';

@Controller('chambers')
export class ChambersController {

  constructor(private readonly chambersService: ChambersService) {}

  @Get('/get')
  findAll(): IChamber[] {
    return this.chambersService.findAll();
  }

  // @Post('/get')
  // findAll(): IChamber[] {
  //   return this.chambersService.findAll();
  // }

  @Post()
  async upsert(@Body() upsertChamberDto: UpsertChamberDto) {
    console.log('upsertChamberDto', upsertChamberDto);
    this.chambersService.create(upsertChamberDto);
  }

}
