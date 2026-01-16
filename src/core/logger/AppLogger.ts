import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger, createLogger, format, transports } from 'winston';

enum WinstonLogLevel {
  INFO = 'info',
  ERROR = 'error',
  WARN = 'WARN',
  HTTP = 'HTTP',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

@Injectable()
export default class AppLogger implements LoggerService {
  public logger: Logger;
  constructor(config: ConfigService) {
    const { combine, timestamp, label, errors, printf } = format;
    const customLoggerFormat = printf(({ level, message, timestamp, stack }) => {
      return `${ timestamp } ${ level }: ${ stack || message } ${ stack}`;
    });
    this.logger = createLogger({
      level: 'info',
      format: combine(label({ label: config.get('app.name') }), timestamp(), errors({ stack: true }), customLoggerFormat),
      transports: [new transports.Console(), new transports.File({ filename: 'logs/error.log', level: 'error' }),new transports.File({ filename: config.get('app.logFileName') })],
    });
  }

  log(message: any) {
    this.logger.log(WinstonLogLevel.INFO, message);
  }
  error(message: any) {
    this.logger.log(WinstonLogLevel.ERROR, message);
  }
  warn(message: any) {
    this.logger.log(WinstonLogLevel.WARN, message);
  }
  debug?(message: any) {
    this.logger.log(WinstonLogLevel.DEBUG, message);
  }
  verbose?(message: any) {
    this.logger.log(WinstonLogLevel.VERBOSE, message);
  }
}
