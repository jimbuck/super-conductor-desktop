import uuid from 'node-uuid';

import {Server as WebSocketServer} from 'ws';
import logger from '../logging/logger';

import Dispatcher from './dispatcher';

export default class SocketServer {
  constructor(opts) {
    opts = opts || {};

    if (!opts.server) {
      throw new Error('Must provide base `server`!');
    }
  
    this._baseServer = opts.server;
    
    this.server = new WebSocketServer({ server: this._baseServer });
    
    this.dispatcher = new Dispatcher();
  }
  
  init() {
    this.server.on('connection', (ws) => {
      ws.id = uuid.v1();
      logger.info(`WebSocket connection opened for client ${ws.id}.`);

      // Connect       
      this.dispatcher.track(ws);
      
      // Update
      ws.on('message', message => {
        this.dispatcher.route(ws, JSON.parse(message));
      });
      
      // Disconnect
      ws.on('close', () => {
        this.dispatcher.drop(ws.id);
        logger.info(`Client ${ws.id} closed their connection.`);
      });
    });
  }
}