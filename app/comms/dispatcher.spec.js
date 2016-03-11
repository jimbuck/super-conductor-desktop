
import uuid from 'node-uuid';

import Dispatcher from './dispatcher';
import {MESSAGE_TYPE} from '../models/enums';

import {customMatchers} from '../spec-helpers';
beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('Comms#Dispatcher', () => {
  
  function createMockSocket(sourceId, cb) {
    return {
      id: sourceId,
      send: cb || function() { }
    };
  }
  
  it('should be a constructor function', () => {
    expect(Dispatcher).toBeTypeof('function');
  });
  
  it('should initialize with no clients', () => {
    const dispatcher = new Dispatcher();
    
    expect(dispatcher.pendingConnections).toBe(0);
    expect(dispatcher.currentConnections).toBe(0);
  });
  
  it('should track pending clients', () => {
    const dispatcher = new Dispatcher();
    
    const connectionA = uuid.v1();
    const connectionB = uuid.v1();
    
    dispatcher.track(createMockSocket(connectionA));
    
    expect(dispatcher.pendingConnections).toBe(1);
    
    dispatcher.track(createMockSocket(connectionB));
       
    expect(dispatcher.pendingConnections).toBe(2);
    
    dispatcher.register(connectionA, { source: 'test-app-a' });
    
    expect(dispatcher.pendingConnections).toBe(1);
    expect(dispatcher.currentConnections).toBe(1);
    
    dispatcher.register(connectionB, { source: 'test-app-b' });
    
    expect(dispatcher.pendingConnections).toBe(0);
    expect(dispatcher.currentConnections).toBe(2);
  });
  
  it('should register clients based on app identifier', () => {
    const dispatcher = new Dispatcher();
    
    const appName = 'test-app-a';
    
    const connectionA = uuid.v1();
    const connectionB = uuid.v1();
    
    dispatcher.track(createMockSocket(connectionA));    
    dispatcher.track(createMockSocket(connectionB));
    
    dispatcher.register(connectionA, { source: appName });
    
    expect(() => {
      dispatcher.register(connectionB, { source: appName });
    }).toThrow();
    
    expect(dispatcher.pendingConnections).toBe(1);
    expect(dispatcher.currentConnections).toBe(1);
  });
  
  it('should broadcast to all clients', () => {
    const dispatcher = new Dispatcher();

    dispatcher._createAction = (source, action, data) => {
      return {
        source,
        action,
        data,
        type: MESSAGE_TYPE.ACTION,
        time: Date.now()
      };
    };
    
    const sourceId = uuid.v1();
    const sourceName = 'source-app';
    const expectedAction = 'test';
    const expectedData = { player: 'JimmyBoh', gold: 512 };
    
    const otherApps = ['app-a', 'app-b', 'app-c', 'app-d'];
    
    // Track and Register the source app...
    dispatcher.track(createMockSocket(sourceId, (data) => {
      if (data.action !== 'ack') {
        throw new Error('Broadcast returned to user!');
      }
    }));
    dispatcher.register(sourceId, { source: sourceName, schema: {} });
    
    // Track and register each client app...
    for (let i = 0; i < otherApps.length; i++){
      let appName = otherApps[i];
      let appId = uuid.v1();
      
      dispatcher.track(createMockSocket(appId, (data) => {
        if (data.action === 'ack') return;
        
        expect(data.source).toBe(sourceName);
        expect(data.action).toBe(expectedAction);
        expect(data.data).toBe(expectedData);
        expect(data.type).toBe(MESSAGE_TYPE.ACTION);

        let index = otherApps.indexOf(appName);
        expect(index).toBeGreaterThan(-1);
        expect(index).toBeLessThan(otherApps.length);
        otherApps.splice(index, 1); // Remove it!
      }));
      dispatcher.register(appId, { source: appName });
    }
    
    // Check that all clients are registered...
    expect(dispatcher.currentConnections).toBe(5);
    
    // Broadcast the message...
    dispatcher.broadcast(sourceId, expectedAction, expectedData);

    // Check to make sure the list was completely covered.    
    expect(otherApps.length).toBe(0);
  });
  
  it('should route messages to the corresponding clients');
  
  it('should remove clients on drop', () => {
    const dispatcher = new Dispatcher();
   
    const connectionA = uuid.v1();
    const connectionB = uuid.v1();
    const connectionC = uuid.v1();
    const connectionD = uuid.v1();
    
    dispatcher.track(createMockSocket(connectionA));
    dispatcher.track(createMockSocket(connectionB));
    dispatcher.track(createMockSocket(connectionC));
    dispatcher.track(createMockSocket(connectionD));

    dispatcher.register(connectionA, { source: 'app-a' });
    dispatcher.register(connectionB, { source: 'app-b' });
    
    expect(dispatcher.pendingConnections).toBe(2);
    expect(dispatcher.currentConnections).toBe(2);
    
    dispatcher.drop(connectionA);
    
    expect(dispatcher.pendingConnections).toBe(2);
    expect(dispatcher.currentConnections).toBe(1);
    
    dispatcher.drop(connectionD);
    
    expect(dispatcher.pendingConnections).toBe(1);
    expect(dispatcher.currentConnections).toBe(1);
  });
  
});