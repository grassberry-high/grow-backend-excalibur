import { Injectable } from '@nestjs/common';

import debug from 'debug';
const debugRestHelper = debug('helper:rest');
const debugRestHelperVerbose = debug('helper:rest:verbose');

import request from 'request';

import {LoggerService} from '../../helpers/logger/logger.service';

const token = process.env.API_TOKEN || 'newKidsOntheBlock';


@Injectable()
export class ApiService {
  logger;
  constructor(
    private loggerService: LoggerService
  ){
    this.logger = loggerService.getLogger();
  }
  /**
   * Adds the sending method to the request
   */
  addMethod(method: string, url: string) {
    switch (method.toLowerCase()) {
      case 'post':
        return request.post(url);
      case 'get':
        return request.get(url);
      case 'update':
        return request.update(url);
      case 'delete':
        return request.delete(url);
      default:
        throw new Error('method not supported');
    }
  };

  /**
   * Formats the data and adds it to the request
   * @param {object} emitRequest
   * @param {string} method
   * @param {object} data
   * @return {*}
   */
  addData(emitRequest, method, data) {
    switch (method.toLowerCase()) {
      case 'post':
        return emitRequest.json(data);
      case 'get':
        return emitRequest;
      case 'update':
        return emitRequest.json(data);
      case 'delete':
        return emitRequest;
      default:
        throw new Error('method not supported');
    }
  };

  /**
   * Emits a request
   * @param {string} method: GET,POST ...
   * @param {string} url
   * @param {object} data
   * @param {*} callback
   */
  emit(method, url, data, callback) {
    debugRestHelper('method', method, 'url', url);
    debugRestHelperVerbose('data', data);
    const emitRequest = this.addMethod(method, url).auth(null, null, true, token);
    this.addData(emitRequest, method, data)
      .on('response', (res) => {
        if (res.statusCode === 200) {
          data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            let err;
            try {
              data = data.toString();
              if (data.charAt(0) === '<') {
                return callback(`Response is an html page => forwarded ${url}, ${method.toUpperCase()}`);
              } // html page
              debugRestHelperVerbose('Reponse', data);
              data = JSON.parse(data);
            } catch (error) {
              err = error;
              // dumpError(err); // TODO: use logger
              debugRestHelperVerbose('Reponse', data);
              debugRestHelperVerbose('data.charAt(0)', data.charAt(0));
              return callback(`Response invalid ${err}}, ${url}, ${method.toUpperCase()}`);
            }

            if ((data == null) || (data === '')) {
              return callback(`No response ${url}, ${method.toUpperCase()}`);
            }
            if (data.err) {
              return callback(data.err);
            }
            return callback(null, data);
          });
        } else {
          this.logger.warn(`Error: ${res.statusCode}, ${url}, ${method.toUpperCase()}`, {data});
          return callback(`Error: ${res.statusCode}, ${url}, ${method.toUpperCase()}`);
        }
      })
      .on('error', (err) => {
        this.logger.warn(`Error no connection ${url}, ${method.toUpperCase()}`, {err});
        return callback(`Error no connection ${url}, ${method.toUpperCase()}`);
      });
  };
}

