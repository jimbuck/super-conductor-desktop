
import Dispatcher from './dispatcher';
import {MESSAGE_TYPE} from '../data/enums';

describe('Comms#Dispatcher', () => {
  
  function createMockSocket(send) {
    return {
      send
    };
  }
  
  it('should be a constructor function', () => {
    expect(typeof Dispatcher).toBe('function');
  });
  
  it('should initialize with no clients', () => {
    const dispatcher = new Dispatcher();
    
    expect(dispatcher.connections).toBe(0);
  });
  
  it('should track registered clients', () => {
    const dispatcher = new Dispatcher();
    
    dispatcher.register('test-app-a', {}, {});
    
    expect(dispatcher.connections).toBe(1);
    
    dispatcher.register('test-app-b', {}, {});
    
    expect(dispatcher.connections).toBe(2);
  });
  
  it('should register clients based on app identifier', () => {
    const dispatcher = new Dispatcher();
    
    const appName = 'test-app-a';
    
    expect(() => {
      dispatcher.register(appName, {}, {});
      dispatcher.register(appName, {}, {});
    }).toThrow();
    
    expect(dispatcher.connections).toBe(1);
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
    
    const sourceName = 'source-app';
    const expectedAction = 'test';
    const expectedData = {
      player: 'JimmyBoh',
      gold: 512
    };
    
    const otherApps = ['app-a', 'app-b', 'app-c', 'app-d'];
        
    dispatcher.register(sourceName, {}, createMockSocket(sourceName, (data) => {
      throw new Error('Should never happen!');
    }));
    
    for (let i = 0; i < otherApps.length; i++){
      let appName = otherApps[i];
      dispatcher.register(appName, {}, createMockSocket((data) => {
        expect(data.source).toBe(sourceName);
        expect(data.action).toBe(expectedAction);
        expect(data.data).toBe(expectedData);
        expect(data.type).toBe(MESSAGE_TYPE.ACTION);
        
        let index = otherApps.indexOf(appName);
        expect(index).toBeGreaterThan(-1);
        expect(index).toBeLessThan(otherApps.length);
        otherApps.splice(index, 1); // Remove it!
      }));
    }
    
    expect(dispatcher.connections).toBe(5);
    dispatcher.broadcast(sourceName, expectedAction, expectedData);
    expect(otherApps.length).toBe(0);
    expect(dispatcher.connections).toBe(5);
  });
  
});