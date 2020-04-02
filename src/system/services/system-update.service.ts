import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const CRONJOB_LICENSE_PATTERN = '0 0 0 * * *';
import { Injectable } from '@nestjs/common';
import debug from 'debug';
const debugSystemUpdate = debug('system:update');

import async from 'async';
import * as moment from 'moment';

// TODO: reactivate

//
//
// import {logger} from '../_logger/logger.js';
//
// import {CronJob} from 'cron';
// import {EventModel} from '../data-logger/event.model';
//
// import {SensorDataModel} from '../data-logger/sensor-data.model';
//
// import {ServerLogModel} from '../_logger/server-log.model';
//
// import {SessionModel} from '../system/session.model';
//
// import {ChamberModel} from '../chamber/chamber.model';
//
// import {CronjobModel} from '../cronjob/cronjob.model';
//
// import {RuleModel} from '../rule/rule.model';
//
// import {bootSensorsAndRelays} from '../_helper/ouputAndSensorBoot.helper.js';

import {ShellService} from '../shell/shell.service.js';

import { System } from '../system.model';
import { ApiService } from '../api/api.service';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class SystemUpdateService {

  constructor(
    @InjectModel('System') private readonly systemModel: ReturnModelType<typeof System>,
    private apiService: ApiService,
    private shellService: ShellService
  ) {}

  // --------------------------- License -----------------------------
  async getLicenseInformation(options, callback) {
    return 123 // TODO
    // async.waterfall([
    //   (next) => this.shellService.getSerial(next),
    //   (serial, next) => {
    //     if (serial === 'MAC OSX') {
    //       return next(null, 'MAC OSX', {payload: {validTill: moment().add('1', 'hours').toISOString()}});
    //     }
    //     const method = 'GET';
    //     const url = `${apiEndpoints['licenses']}/${encodeURIComponent(serial)}`;
    //     const data = {};
    //     debugSystemUpdate(`getting license for serial ${serial} from ${url}`);
    //     this.apiService.emit(method, url, data, (err, license) => next(err, serial, license));
    //   },
    //   (serial, license, next) => {
    //     debugSystemUpdate('License', license);
    //     if (!license.payload) {
    //       return next();
    //     }
    //     const licenseData = {
    //       enabledFeatures: license.payload.enabledFeatures || {},
    //       serial,
    //       lastConnect: moment(),
    //     };
    //     debugSystemUpdate('Updating system', licenseData);
    //     this.systemModel.findOneAndUpdate({}, licenseData, {upsert: true}).exec((err) => {
    //       return next(err, licenseData);
    //     });
    //   },
    // ], (err, licenseData) => callback(err, licenseData));
  }

  // // --------------------------- Cronjobs -----------------------------
  // bootLicenseCronjob() {
  //   new CronJob(CRONJOB_LICENSE_PATTERN,
  //     () => {
  //       const options = {};
  //       getLicenseInformation(options, (err) => {
  //         if (err) {
  //           logger.error(err);
  //         }
  //       });
  //     },
  //     () => {
  //     },
  //     // console.log 'cron xyz'
  //     true,
  //     'Europe/Amsterdam'// http://momentjs.com/timezone/ #TODO TIMEZONE & LANGUAGE SETTING
  //   );
  // };
  //
  // // --------------------------- Settings Updates -----------------------------
  // updateSystem(appUser, data, options, callback) {
  //   // sanitize
  //   let key;
  //   const allowedUpdates = ['region', 'timeZone', 'units', 'wifi'];
  //   for (key in data) {
  //     if (allowedUpdates.indexOf(key) === -1) {
  //       delete data[key];
  //     }
  //   }
  //
  //   this.systemModel.findOne({}).exec((err, system) => {
  //     if (err) {
  //       return callback(err);
  //     }
  //     if (!system) {
  //       system = new this.systemModel();
  //     }
  //     system = Object.assign(system, data);
  //     system.save((err, system) => {
  //       if (err) {
  //         return callback(err);
  //       }
  //       const bootOptions = {noCrons: true};
  //       bootSensorsAndRelays(bootOptions, (err) => callback(err, system));
  //     });
  //   });
  // };
  //
  // reset(callback) {
  //   // TODO: this just deletes the db data, better would be to reseed
  //   async.parallel({
  //     chamber(next) {
  //       ChamberModel.remove({}).exec(next);
  //     },
  //     cronjobs(next) {
  //       CronjobModel.remove({}).exec(next);
  //     },
  //     rules(next) {
  //       RuleModel.remove({}).exec(next);
  //     },
  //     events(next) {
  //       EventModel.remove({}).exec(next);
  //     },
  //     sensorData(next) {
  //       SensorDataModel.remove({}).exec(next);
  //     },
  //     serverLogs(next) {
  //       ServerLogModel.remove({}).exec(next);
  //     },
  //     sessions(next) {
  //       SessionModel.remove({}).exec(next);
  //     },
  //   }, (err) => callback(err));
  // }
}

