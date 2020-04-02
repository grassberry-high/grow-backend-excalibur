import { Body, Controller, Post } from '@nestjs/common';
import { ChambersService } from './chambers.service';
import { GetChamberDto } from './dto/chamber-get.dto';
import { Chamber } from './chamber.model';

@Controller('chambers')
export class ChambersController {

  constructor(private readonly chambersService: ChambersService) {}

  @Post('/get')
  findAll(@Body() chamberQuery: GetChamberDto): Promise<Chamber[]> {
    return this.chambersService.findAll(chamberQuery.filter, chamberQuery.options);
  }

  // @Post()
  // async upsert(@Body('chamber') upsertChamberDto: UpsertChamberDto) {
  //   console.log('upsertChamberDto', upsertChamberDto);
  //   this.chambersService.create(upsertChamberDto);
  // }

}
