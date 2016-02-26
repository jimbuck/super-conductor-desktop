
import {Logger, transports} from 'winston';

import env from '../env';

const logger = new (Logger)({
  level: env === 'development' ? 'verbose' : 'info',
  handleExceptions: true,
  humanReadableUnhandledException: true,
  transports: [
    new transports.Console(),
    new transports.File({ filename: __dirname + '\\sc-log.txt' })
  ]
});

export default logger;