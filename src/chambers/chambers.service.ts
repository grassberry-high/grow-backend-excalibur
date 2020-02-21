import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IChamber } from './interfaces/chamber.interface';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class ChambersService {
  constructor(@InjectModel('Chamber') private readonly chamberModel: Model<IChamber>) {}

  private readonly chambers: IChamber[] = [];

  create(chamber: IChamber) {
    this.chambers.push(chamber);
  }

  async findAll(): Promise<IChamber[]> {
    return this.chamberModel.find().exec();;
  }
}
