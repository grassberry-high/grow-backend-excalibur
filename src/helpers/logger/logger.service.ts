import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import {createLogger, format, transports} from 'winston';
import mkdirp from 'mkdirp';
import blocked from 'blocked';
const environment = process.env.NODE_ENV;
import 'winston-mongodb';
import { SocketIOMessengerService } from '../socket-io-messenger/socket-io-messenger.service';

const mongoDBUri = encodeURI(process.env.MONGODB_URL);

@Injectable()
export class LoggerService {
  logger;
  constructor(
    private socketIOMessengerService: SocketIOMessengerService) {
  }

  /**
   * Launches a logger
   * @param {*} callback: fn(err, logger)
   * @return {*}
   */
  async launchLogger () {
    mkdirp('logs/gh', (err) => {
      if (err) {
        console.log(err);
      }
    });

    const filterArray = format((info, opts) => {
      if (info.meta && info.meta.data && info.meta.data.length) {
        info.meta.data = [`Stripped Array length ${info.meta.data.length}`];
      }
      return info;
    });

    this.logger = createLogger({
      level: 'error',
      exitOnError: false,
      format: format.combine(
        filterArray(),
        format.json()
      ),
      transports: [
        new transports.Console({
          level: 'debug',
        }),
      ],
    });

    this.logger.stream = {
      write(message) {
        this.logger.info(message);
      },
    };

    this.logger.on('logging', (transport, level, message, meta) => {
      const timestamp = moment().toISOString();
      // console.log "[#{message}] and [#{JSON.stringify(meta)}] have now been logged (#{transport.label}) at level: [#{level}] at #{timestamp}"
      if (transport.label === 'mongoLogger') {
        if (level === 'info') {
          this.socketIOMessengerService.sendLog('userLog', {
            'message': message,
            'level': level,
            'meta': meta,
            'timestamp': timestamp,
          });
          this.socketIOMessengerService.sendLog('adminLog', {
            'message': message,
            'level': level,
            'meta': meta,
            'timestamp': timestamp,
          });
        } else {
          this.socketIOMessengerService.sendLog('adminLog', {
            'message': message,
            'level': level,
            'meta': meta,
            'timestamp': timestamp,
          });
        }
      }
    });

    blocked((ms) => {
      if (ms > 10000) {
        this.logger.error(`Event Loop was blocked for ${ms}`);
      } else {
        this.logger.warn(`Event Loop was blocked for ${ms}`);
      }
    }, {threshold: 1000});
    return this.logger;
  };

  getLogger() {
    return this.logger;
  }

  addMongoDBTransport () {
    // TODO
    // this.logger.add(new transports.MongoDB({
    //   label: 'mongoLogger',
    //   level: 'silly',
    //   db: mongoDBUri,
    //   collection: 'serverlogs',
    //   handleExceptions: false,
    //   colorize: false,
    //   timestamp: true,
    // }));
  };

  error(...err) {
    console.error(err);
    ;
  }

  // /**
  //  * Get a fake logger (to console vs to DB)
  //  * @return {object} fakeLogger
  //  */
  // // TODO: mv into own file
  // getStub () => ({
  //   silly(msg) {
  //     console.log(chalk.blue(`blue: ${msg}`));
  //   },
  //   info(msg) {
  //     console.log(chalk.green(`info: ${msg}`));
  //   },
  //   warn(msg) {
  //     console.log(chalk.yellow(`warn: ${msg}`));
  //   },
  //   error(msg) {
  //     console.log(chalk.red(`error: ${msg}`));
  //   },
  //   debug(msg) {
  //     console.log(chalk.magenta(`debug: ${msg}`));
  //   },
  // });
}









