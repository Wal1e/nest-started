import { Injectable } from '@nestjs/common';
import * as log4js from 'log4js';
import * as path from 'path';

@Injectable()
export class CustomLoggerService {
  constructor() {
    log4js.configure({
      // appenders: {
      //   http: {
      //     type: 'file',
      //     filename: path.join(__dirname, '../data/logger/http.log'),
      //   },
      //   info: {
      //     type: 'dateFile',
      //     filename: path.join(__dirname, '../data/logger/info.log'),
      //     alwaysIncludePattern: true,
      //     keepFileExt: true,
      //     compress: true,
      //   },
      // },
      // categories: {
      //   default: {
      //     appenders: ['info'],
      //     level: 'info',
      //   },
      //   http: {
      //     appenders: ['http'],
      //     level: 'info',
      //   },
      // },
      appenders: {
        console: { type: 'console' },
        app: {
          type: 'file',
          // filename: path.join(__dirname, '../data/logger/info.log'),
          filename: '../data/logger/info.log',
          keepFileExt: true,
        },
      },
      categories: {
        default: { appenders: ['console'], level: 'trace' },
        catA: { appenders: ['console'], level: 'error' },
        'catA.catB': { appenders: ['app'], level: 'trace' },
      },
    });
  }
  http() {
    // const httpLogger = log4js.getLogger('http');
    // httpLogger.info('123');
    const loggerA = log4js.getLogger('catA');
    loggerA.error('This will be written to console with log level ERROR');
    loggerA.trace('This will not be written');
    const loggerAB = log4js.getLogger('catA.catB');
    loggerAB.error(
      'This will be written with log level ERROR to console and to a file',
    );
    loggerAB.trace(
      'This will be written with log level TRACE to console and to a file',
    );
  }
}
