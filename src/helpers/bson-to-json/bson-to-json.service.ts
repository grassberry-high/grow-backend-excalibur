import { Injectable } from '@nestjs/common';
import * as _ from "lodash";
import {Types} from 'mongoose';
import ObjectId = Types.ObjectId;
import { ComparisonService } from '../comparison/comparison.service';

@Injectable()
export class BsonToJsonService {
  constructor(
    private readonly comparisonService: ComparisonService
  ){}

  bsonToJson(bson) {
    // mongoose object
    if (bson.toObject) {
      bson = bson.toObject({'depopulate': true});

      // mongoose ID
    } else if (bson instanceof ObjectId) {
      bson = bson.toString();
    }

    if (['array', 'object'].indexOf(this.comparisonService.determineType(bson)) !== -1) {
      bson = _.forEach(bson, (value, key) => {
        if (value != null) {
          bson[key] = this.bsonToJson(bson[key]);
        } else {
          delete bson[key];
        }
      });
    }
    return bson;
  };
}
