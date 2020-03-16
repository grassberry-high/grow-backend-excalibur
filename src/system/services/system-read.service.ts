import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISystem } from '../interfaces/system.interface';
import debug from 'debug';
const debugSystemRead = debug('system:read');

import * as moment from 'moment';

@Injectable()
export class SystemReadService {
  constructor(@InjectModel('System') private readonly systemModel: Model<ISystem>) {}
  async get(filter): Promise<ISystem> {
    filter = filter || {};
    const options = {lean: true};
    return this.systemModel.findOne(filter, options).exec();
  };

  async isValid() {
    const filter = {};
    const system = await this.get(filter);

    if (!system || !system.validTill) {
      return false;
    }
    return moment(system.validTill).diff(moment(), 'seconds') > 0;
  };
}


