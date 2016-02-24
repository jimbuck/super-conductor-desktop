import http from 'http';

import HttpServer from './http-server';
import SocketServer from './socket-server';

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

    this.server.listen(port, function() {
      console.log(`SCServer listening on port ${port}!`);
    });
  }
}