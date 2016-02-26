
import {Transport} from 'winston';

class BrowserConsoleLogger extends Transport
{
  constructor(options) {
    
    super(options);
  }

  log(level, msg, meta, callback) {
    
    if (window && window.console) {   
      switch (level) {
        case 'error':
          window.console.error(msg, meta);
          break;
        case 'warn':
          window.console.warn(msg, meta);
          break;
        default:
          window.console.log(msg, meta);
      }
    }
    
    callback(null, true);
  }
}

BrowserConsoleLogger.prototype.name = 'browserConsoleLogger';

export default BrowserConsoleLogger;