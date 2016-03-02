
import jetpack from 'fs-jetpack';
import {Logger, transports} from 'winston';
import electron from 'electron';

let app = electron.app || (electron.remote || {}).app;

import env from '../env';

let logs = jetpack.cwd(app.getPath('userData')).dir('logs');

const logFilePath = logs.cwd()  + '\\log.txt';

const loggerTransports = [];

if (env.name !== 'production') {
  loggerTransports.push(new transports.Console({
    level: 'silly',
    colorize: true,
    prettyPrint: true,
    humanReadableUnhandledException: true
  }));
}

loggerTransports.push(new transports.File({
  level: env.name === 'development' ? 'verbose' : 'info',
  filename: logFilePath,
  tailable: true,
  maxsize: 1024 * 1024 * 50, // 50 MB
  maxFiles: 20
}));

const logger = new (Logger)({
  handleExceptions: true,
  humanReadableUnhandledException: true,
  transports: loggerTransports
});

export default logger;