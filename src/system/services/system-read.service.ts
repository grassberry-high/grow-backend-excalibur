import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { System } from '../system.model';
import debug from 'debug';
const debugSystemRead = debug('system:read');

import * as moment from 'moment';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class SystemReadService {
  constructor(@InjectModel('System') private readonly systemModel: ReturnModelType<typeof System>) {}
  async get(filter): Promise<System> {
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


