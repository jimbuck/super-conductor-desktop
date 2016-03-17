
import {SettingsManager, settings} from './settings-manager';

import {customMatchers} from '../spec-helpers';
beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

function noop() { };

class MockFs {
  constructor(){}
  read(filename, type){
    return Promise.resolve();
  }
  write(filename, data, opts){
    return Promise.resolve();
  }
}

describe('Utils#SettingsManager', () => {

  it('should be a constructor function', () => {
    expect(SettingsManager).toBeTypeof('function');
  });

  it('should not require defaults', () => {
    expect(() => {
      new SettingsManager();
    }).not.toThrow();
  });

  it(`should return all values for 'all'`, () => {

    let sm = new SettingsManager();

    spyOn(sm.storage, 'get');    

    sm.all;
    
    expect(sm.storage.get).toHaveBeenCalledWith(/* undefined */);
  });  
  
  it('should get values based on key', () => {
    let settingName = 'connectionPort';
    let expectedValue = 2096;

    let defaults = {};
    defaults[settingName] = expectedValue;

    let sm = new SettingsManager(defaults);

    spyOn(sm.storage, 'get');

    sm[settingName];
           
    expect(sm.storage.get).toHaveBeenCalledWith(settingName);
  });

it('should return defaults if values are not defined', () => {
    let settingName = 'connectionPort';
    let expectedValue = 6789;

    let defaults = {};
    defaults[settingName] = undefined;

    let sm = new SettingsManager(defaults);

    spyOn(sm.storage, 'get').and.returnValue(expectedValue);    

    let actualValue = sm[settingName];
  
    expect(sm.storage.get).toHaveBeenCalledWith(settingName);    
    expect(actualValue).toBe(expectedValue);
  });

  it('should set values', () => {
    let settingName = 'connectionPort';
    let expectedValue = 6789;

    let defaults = {};
    defaults[settingName] = 6789;

    let sm = new SettingsManager(defaults);

    spyOn(sm.storage, 'set');    

    sm[settingName] = expectedValue;

    expect(sm.storage.set).toHaveBeenCalledWith(settingName, expectedValue);
  }); 

});

describe('Utils#Settings', () => {

  it('should be a SettingsManager instance', () => {
    expect(settings).toBeInstanceOf(SettingsManager);
  });

  it('should contain a port setting', () => {
    expect(settings.connectionPort).toBeTypeof('number');    
  });
  
  it('should contain a setting to restrict clients to localhost', () => {
    expect(settings.restrictToLocalhost).toBeTypeof('boolean');
  });
  
  it('should contain a setting to run at startup', () => {
    expect(settings.runAtStartup).toBeTypeof('boolean');
  });

  it('should contain a setting to minimize to the tray', () => {
    expect(settings.minimizeToTray).toBeTypeof('boolean');
  });

  it('should contain a setting to open at startup', () => {
    expect(settings.openAtStartup).toBeTypeof('boolean');
  });

  it('should contain a setting to enable broadcast functionality', () => {
    expect(settings.enableBroadcast).toBeTypeof('boolean');
  });

  it('should contain a setting to send anonymous usage statistics', () => {
    expect(settings.sendUsageStatistics).toBeTypeof('boolean');
  });  
});