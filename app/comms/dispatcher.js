
import {EventEmitter} from 'events';

import logger from '../logging/logger';
import {MESSAGE_TYPE} from '../data/enums';
import Dictionary from '../utils/dictionary';

const ID_SEPARATOR = '|';

export default class Dispatcher {
  constructor() {    
    // Used to hold the sockets for clients that have not registered yet.
    this.pending = new Dictionary();
    
    // Used to hold the sockets that have registered and sent
    this.clients = new Dictionary();
    this.idToName = new Dictionary();
    
    // setInterval(() => {
    //   logger.silly('pending = ' + this.pendingConnections);
    //   logger.silly('current = ' + this.currentConnections);
    // }, 1000);
    
  }
  
  get currentConnections() {
    return this.clients.count;
  }
  
  get pendingConnections() {
    return this.pending.count;
  }
  
  track(channel) {
    logger.debug(`Now tracking client ${channel.id}.`);
    this.pending.set(channel.id, channel);
  }
  
  register(id, data) {
    logger.debug(`Registering client ${id}...`);
    
    let channel = this.pending.get(id);
    
    if (!channel) throw new Error(`Client ${id} was not found!`);
    
    this.idToName.set(id, data.source);
    this.clients.set(data.source, {
      channel,
      schema: data.schema
    });
    this.pending.delete(id);
    
    channel.send(this._createAction('super-conductor', 'ack', id));
  }
   
  route(channel, message) {
    logger.debug(`Routing ${MESSAGE_TYPE[message.type]} message from client ${channel.id}...`, message);
    
    switch (message.type) {
      case MESSAGE_TYPE.REGISTER:
        this.register(channel.id, message);
        break;
      case MESSAGE_TYPE.EVENT:
        this.broadcast(channel.id, message.action, message.data);
        break;
      case MESSAGE_TYPE.ACTION:
        
        break;
      default:
        
        break;
    }
  }
  
  drop(id) {
    logger.debug(`Dropping client ${id}...`);
    let name = this.idToName.get(id);
    
    this.pending.delete(id);
    this.clients.delete(name);
    this.idToName.delete(id);
  }
  
  broadcast(source, action, data) {
    let sourceName = this.idToName.get(source);
    logger.debug(`Broadcasting for ${sourceName}...`);
    let payload = this._createAction(sourceName, action, data);
    
    this.clients.forEach((client, clientName) => {
      if (clientName === sourceName) return;
      
      logger.debug(`Broadcasting to ${clientName}...`);
      client.channel.send(payload);
    });
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