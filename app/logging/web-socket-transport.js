import util from 'util';
import winston from 'winston';

export default class WebSocketLogger extends winston.Transport{
  constructor(options) {
    
    super();
    
    //
    // Name this logger
    //
    this.name = 'webSocketLogger';

    //
    // Set the level from your options
    //
    this.level = options.level || 'info';

    //
    // Configure your storage backing as you see fit
    //
  }

  log(level, msg, meta, callback) {
    //
    // Store this message and metadata, maybe use some custom logic
    // then callback indicating success.
    //
    callback(null, true);
  }
}