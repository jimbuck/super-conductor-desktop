import {Server as WebSocketServer} from 'ws';
import {EventEmitter} from 'events';

import logger from '../logging/logger';

import Dispatcher from '../comms/dispatcher';

export default class SocketServer extends EventEmitter {
  constructor(opts) {
    opts = opts || {};

    if (!opts.server) {
      throw new Error('Must provide `server`!');
    }

    super();

    this._baseServer = opts.server;

    this.server = new WebSocketServer({ server: this._baseServer });
    
    this.dispatcher = new Dispatcher();

    this.server.on('connection', (ws) => {
      logger.debug('WebSocket connection opened.');
      
      ws.on('close', () => {
        logger.debug('WebSocket connection closed.');
      });

      ws.on('message', (payload) => this._broadcast(ws, payload));
    });
  }

  _broadcast(origin, payload) {
    for (let client in this.server.clients) {
      if (origin && client === origin) continue;

      client.send(payload);
    }
  }

  broadcast(source, action, data) {
    let payload = createPayload(source, action, data);

    this._broadcast(null, payload);
  }
}

function createPayload(source, action, data) {
  return JSON.stringify({
    source,
    action,
    data,
    time: Date.now()
  });
}