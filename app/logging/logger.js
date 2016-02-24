
import {Logger, transports} from 'winston';

import WebSocketLogger from './web-socket-transport';

const logger = new (Logger)({
  level: 'debug',
  transports: [
    new transports.Console(),
    new transports.File({ filename: __dirname + '\\sc-log.txt' }),
    //new WebSocketLogger({})
  ]
});

export default logger;