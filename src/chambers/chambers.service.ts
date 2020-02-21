import { Injectable } from '@nestjs/common';
import { IChamber } from './interfaces/chamber.interface';

@Injectable()
export class ChambersService {

  private readonly chambers: IChamber[] = [];

  create(chamber: IChamber) {
    this.chambers.push(chamber);
  }

  findAll(): IChamber[] {
    return this.chambers;
  }
}
