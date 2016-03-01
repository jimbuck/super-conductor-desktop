
import {EventEmitter} from 'events';

import SocketServer from './socket-server';

import Dispatcher from './dispatcher';
import {Server as WebSocketServer} from 'ws';

import {customMatchers} from '../spec-helpers';
beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('Comms#SocketServer', () => {

  function noop() { }
  
  function createBaseServer() {
    let server = new EventEmitter();
    
    return server;
  }
  
  it('should be a constructor function', () => {
    expect(SocketServer).toBeTypeof('function');
  });
  
  it('should require a base server to bind to', () => {
    expect(() => {
      new SocketServer({});
    }).toThrow();
  });
  
  it('should create a WebSocketServer', () => {
    const wss = new SocketServer({
      server: createBaseServer()
    });
    
    expect(wss.server).toBeDefined();
  });
  
  it('should create a Dispatcher', () => {
    const wss = new SocketServer({
      server: createBaseServer()
    });
    
    expect(wss.dispatcher).toBeDefined();
    expect(wss.dispatcher).toBeInstanceOf(Dispatcher);
  });
  
  describe('On Connection', () => {
    
    let wss;
    let triggerConnection;
    
    beforeEach(() => {
      let server = new EventEmitter();
            
      wss = new SocketServer({
        server: createBaseServer()
      });
      
      wss.server = server;
      
      wss.init();
      
      triggerConnection = function(socket) {
        server.emit('connection', socket);
      }
    });
    
    it('should assign an identifier to the socket', () => {
      let socket = new EventEmitter();
      
      triggerConnection(socket);
      
      expect(socket.id).toBeDefined();
    });
    
    it('should track new connections', () => {
      let socket = new EventEmitter();
      
      spyOn(wss.dispatcher, 'track');
      
      triggerConnection(socket);
      
      expect(wss.dispatcher.track).toHaveBeenCalledWith(socket);
    });
    
    it('should route messages through the dispatcher', () => {
      let socket = new EventEmitter();
      const expectedData = {
        player: 'JimmyBoh',
        health: 100,
        jumping: true
      };
      const message = JSON.stringify(expectedData);
      
      spyOn(wss.dispatcher, 'route');
      
      triggerConnection(socket);
      
      socket.emit('message', message);
      
      expect(wss.dispatcher.route).toHaveBeenCalledWith(socket, expectedData);
    });
    
    it('should inform the dispatcher when the connection closes', () => {
      let socket = new EventEmitter();

      spyOn(wss.dispatcher, 'drop');

      triggerConnection(socket);

      socket.emit('close');

      expect(wss.dispatcher.drop).toHaveBeenCalledWith(socket.id);
    });
    
  });
  
});