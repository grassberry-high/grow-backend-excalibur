import { Injectable } from '@nestjs/common';

const APP_PATH = process.env.APP_PATH || '/home/pi/app/';
// shared commands
const commandReboot = 'echo reboot > /pipes/reboot.pipe';

import {inspect} from 'util';
import chalk from 'chalk';
import debug from 'debug';

const debugShell = debug('shell');
const debugShellVerbose = debug('shell:verbose');

import async from 'async';
import * as moment from 'moment';

import * as shell from 'shelljs';

import { LoggerService } from '../../helpers/logger/logger.service';


@Injectable()
export class ShellService {
  logger;
  constructor(
    private loggerService: LoggerService
  ) {
    shell.config.silent = true;
    this.logger = this.loggerService.getLogger();
  }

  async executeCommands (commands) {
    if (process.env.NODE_ENV !== 'production') {
      return [{'command': 'node ENV is development', 'code': 0, 'stdout': 'Not executed in dev!'}];
    }
    // commandEchoFinished = "echo \"finished\""
    // commands.push({"name": "commandEchoFinished", "command": commandEchoFinished})
    const results = [];
    async.eachSeries(commands,
      (command, next) =>
        shell.exec(command.command, (code, stdout, stderr) => {
          debugShellVerbose('command', command, 'code', code);
          debugShellVerbose('stdout', stdout, 'stderr', stderr);
          const err = (stderr != null) && (stderr !== '') ? stderr : null;
          if (code !== 0) {
            this.logger.debug(`Command: ${command.name}, exited with code: ${code}`, stdout);
          }
          if (err) {
            this.logger.debug(`Command: ${command.name}`, err);
          }
          // return next err if err?
          results.push({'command': command.name, 'code': code, 'stdout': stdout});
          return next(null);
        })
      ,
      (err) => {
        if (err) {
          throw (err);
        }
        return results;
      });
  }

  // TODO: check this shell cmd
  async zipLogs() {
    const path = APP_PATH + '/logs';
    const commands = [];

    const commandDelteOld = `rm -f ${path}/logs.tar.gz`;
    commands.push({'name': 'commandDelteOld', 'command': commandDelteOld});

    const commandZip = `tar --create --gzip --file=${path}/logs.tar.gz ${path}`;
    commands.push({'name': 'commandZip', 'command': commandZip});

    return await this.executeCommands(commands);
  };

  // TODO: check this shell cmd
  async mongoDump() {
    const path = APP_PATH + '/logs/mongo-dump';
    const commands = [];

    const commandCreate = `mkdir -p ${path}`;
    commands.push({'name': 'commandCreate', 'command': commandCreate});

    const commandMongodump = `mongodump --host localhost --port 27017 --out ${path}/$(date +%F_%T\\\(dayOfW:%u_dayOfM:%d\\\))`;
    commands.push({'name': 'commandMongodump', 'command': commandMongodump});

    return await this.executeCommands(commands);
  };

  async getWifiOptions() {
    if (process.env.OS === 'MAC OSX') {
      return ['MAC OSX'];
    }
    const commands = [];

    const commandGetWifiOptions = `cat < /pipes/wifi.pipe`; // gets from wifi pipe'iwlist wlan0 scan | grep ESSID'
    commands.push({'name': 'commandGetWifiOptions', 'command': commandGetWifiOptions});

    const results = await this.executeCommands(commands);
      if (!results[0]) {
        throw('No wifi detected');
      }
      const wifiOptions = results[0].stdout.replace(/\n/g, '').split(/ESSID:"(.*?)"/g).filter((entry) => entry.trim() !== '');

      return wifiOptions;
  };

  async configureWifi(wifi) {
    if (process.env.OS === 'MAC OSX') {
      throw(`Not able to do this on ${process.env.OS}`);
    }
    if (!wifi || !wifi.name) {
      throw('Please provide wifi name and pass');
    }

    if (!wifi.pass) {
      wifi.pass = '';
    }

    const commands = [];

    const commandFlushOldWifi = 'bash /etc/wpa_supplicant/del-old-wifi.sh';
    commands.push({'name': 'commandFlushOldWifi', 'command': commandFlushOldWifi});

    const commandConfigureWifi = `printf '\nnetwork={%s\n\tssid=\"${wifi.name}\"%s\n\tpsk=\"${wifi.pass}\"%s\n}' >> /etc/wpa_supplicant/wpa_supplicant.conf`;
    commands.push({'name': 'commandConfigureWifi', 'command': commandConfigureWifi});

    commands.push({'name': 'commandReboot', 'command': commandReboot});

    return await this.executeCommands(commands);
  };

  async reset() {
    if (process.env.OS === 'MAC OSX') {
      throw(`Not able to do this on ${process.env.OS}`);
    }

    const commands = [];

    const commandResetWifi = 'sudo cp /etc/wpa_supplicant/wpa_supplicant.backup.conf /etc/wpa_supplicant/wpa_supplicant.conf';
    commands.push({'name': 'commandResetWifi', 'command': commandResetWifi});

    const commandClearHistory = 'history -c'; // TODO: this only cleans the history in the container => also clean on host
    commands.push({'name': 'commandClearHistory', 'command': commandClearHistory});

    commands.push({'name': 'commandReboot', 'command': commandReboot});

    return await this.executeCommands(commands);
  };

// TODO: check this shell cmd
  async configureDateTime (dateTime) {
    if (process.env.OS === 'MAC OSX') {
      throw(`Not able to do this on ${process.env.OS}`);
    }
    ({dateTime} = dateTime);
    const {timeZone} = dateTime;
    if (!dateTime || (moment(dateTime).isValid() === false)) {
      throw('No valid date time specified');
    }
    if (!timeZone) {
      throw('No time zone specified');
    }

    const commands = [];
    const commandSetTime = `date --set '${moment(dateTime).format('YYYY-MM-DD HH:mm:ss')}'`;
    commands.push({'name': 'commandSetTime', 'command': commandSetTime});

    const commandSetTimeZone = `echo '${timeZone}' > /etc/timeZone && dpkg-reconfigure -f noninteractive tzdata`;
    commands.push({'name': 'commandSetTimeZone', 'command': commandSetTimeZone});

    debugShell(`time is now ${ moment().format('YYYY-MM-DD HH:mm:ss')}`);
    return await this.executeCommands(commands);
  };

  async getSerial () {
    if (process.env.OS === 'MAC OSX') {
      throw ('MAC OSX');
    }

    const commands = [];
    const commandGetSerial = 'cat /proc/cpuinfo | grep Serial | cut -d \' \' -f 2';
    commands.push({'name': 'commandGetSerial', 'command': commandGetSerial});
    debugShellVerbose('commands', commands);
    const results = await this.executeCommands(commands);
    debugShellVerbose('results', results);
    if (!results || !results[0] || results[0].code !== 0) {
      debugShell(results[0]);
      throw('Could not get serial');
    }
    return results[0].stdout.replace('\n', '');
  };

  // TODO: check this shell cmd
  async checkDiskSpace () {
    const commands = [];

    const pathPython = `${__dirname}/python/memory.py`;
    console.log(chalk.bgGreen(``, inspect(pathPython)));
    const commandCheckDiskSpace = `python ${pathPython}`;
    commands.push({'name': 'commandCheckDiskSpace', 'command': commandCheckDiskSpace});

    return await this.executeCommands(commands);
  };

  async reboot () {
    if (process.env.OS === 'MAC OSX') {
      throw(`Not able to do this on ${process.env.OS}`);
    }
    const commands = [];
    commands.push({'name': 'commandReboot', 'command': commandReboot});

    return await this.executeCommands(commands);
  };

}
