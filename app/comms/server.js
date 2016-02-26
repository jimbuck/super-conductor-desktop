import http from 'http';

import HttpServer from './http-server';
import SocketServer from './socket-server';

import logger from '../logging/logger';

export default class SCServer {
  constructor() {
    this.server = http.createServer();
    
    this.httpServer = new HttpServer({
      server: this.server
    });

    this.socketServer = new SocketServer({
      server: this.server
    });
  } 

  listen(port) {
    port = port || 6014;  

    this.httpServer.init();
    this.socketServer.init();
    
    this.server.listen(port, function() {
      logger.info(`SCServer listening on port ${port}!`);
    });
  }
}