
import jetpack from 'fs-jetpack';
import {Logger, transports} from 'winston';
import electron from 'electron';

let app = electron.app || (electron.remote || {}).app;

import env from '../env';

let logs = jetpack.cwd(app.getPath('userData')).dir('logs');

const logFilePath = logs.cwd()  + '\\log.txt';

const logger = new (Logger)({
  level: env === 'development' ? 'verbose' : 'info',
  handleExceptions: true,
  humanReadableUnhandledException: true,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: logFilePath,
      tailable: true,
      maxsize: 1024 * 1024 * 50, // 50 MB
      maxFiles: 20
    })
  ]
});

export default logger;