
import {EventEmitter} from 'events';

import logger from '../logging/logger';
import {MESSAGE_TYPE} from '../data/enums';
import Dictionary from '../utils/dictionary';

const ID_SEPARATOR = '|';

export default class Dispatcher extends EventEmitter {
  constructor() {
    super();
    
    this.clients = new Dictionary();
  }
  
  get connections() {
    return this.clients.count;
  }
  
  register(app, options, channel) {
    // TODO: Validate options....
    
    this.clients.set(app, {
      options,
      channel
    });
  }
  
  callAction(event, target, action, data) {
    
  }
  
  broadcast(source, action, data) {
    this.clients.forEach((client, clientName) => {
      if (clientName === source) return;
      
      client.channel.send(this._createAction(source, action, data));
    });
  }
  
  route(message) {
    switch (message.type) {
      case MESSAGE_TYPE.REGISTER:
        logger.debug('Receieved REGISTER message', message);
        break;
      case MESSAGE_TYPE.EVENT:
        logger.debug('Receieved EVENT message', message);
        break;
      case MESSAGE_TYPE.ACTION:
        logger.debug('Receieved ACTION message', message);
        break;
      case MESSAGE_TYPE.CLOSE:
        logger.debug('Receieved CLOSE message', message);
        break;
      default:
        logger.debug('Receieved unknown message', message);
        break;
    }
  }
  
  _createAction(source, action, data) {
    return JSON.stringify({
      source,
      action,
      data,
      type: MESSAGE_TYPE.ACTION,
      time: Date.now()
    });
  }
}