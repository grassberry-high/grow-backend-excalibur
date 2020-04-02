import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Chamber } from './chamber.model';

@Injectable()
export class ChambersService {
  constructor(@InjectModel('Chamber') private readonly chamberModel: ReturnModelType<typeof Chamber>) {}

  private readonly chambers: Chamber[] = [];

  create(chamber: Chamber) {
    this.chambers.push(chamber);
  }

  async findAll(filter, options): Promise<Chamber[]> {
    return this.chamberModel.find(filter, options).exec();
  }
}
