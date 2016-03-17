import JsonStore from './json-store';

import {customMatchers} from '../spec-helpers';
beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

function noop() { };

class MockFs {
  constructor(){}
  read(filename, type){
    return {};
  }
  write(filename, data, opts){
    return;
  }
}

describe('Utils#JsonStore', () => {

  it('should return a constructor function', () => {
    expect(JsonStore).toBeTypeof('function');
  });

  it('should require a filename', () => {
    expect(() => {
      new JsonStore();
    }).toThrow();
  });

  it('should convert the filename from relative to absolute', () => {
    let relativeFilename = './test.json';

    let store = new JsonStore({
      filename: relativeFilename
    });

    expect(store.filename).not.toBe(relativeFilename);
    expect(store.filename.includes(relativeFilename.substring(2))).toBe(true);
  });  

  it('should auto-load data from filesystem by default', () => {
    let fs = new MockFs();

    spyOn(JsonStore.prototype, 'load');

    let store = new JsonStore({
      filename: 'test.json',
      _fs: fs
    });    

    expect(JsonStore.prototype.load).toHaveBeenCalled();
  });

  it('should skip auto-load via options', () => {
    let fs = new MockFs();

    spyOn(fs, 'read');

    let store = new JsonStore({
      filename: 'test.json',
      _fs: fs,
      autoload: false
    });    

    expect(fs.read).not.toHaveBeenCalled();
  });  

  it('should allow manual reloading of the data', () => {
    let fs = new MockFs();

    spyOn(fs, 'read');

    let store = new JsonStore({
      filename: 'test.json',
      _fs: fs,
      autoload: false
    });

    store.load();    

    expect(fs.read).toHaveBeenCalledWith(store.filename, 'jsonWithDates');
  });  

  it('should return all values if no key is specified', () => {
    let store = new JsonStore({
      filename: 'test.json',
      autoload: false
    });

    let allData = {
      'a': 1,
      'b': 2
    };

    store._data = allData;

    expect(store.get()).toBe(allData);
  });

  it('should get values based on key', () => {
    let store = new JsonStore({
      filename: 'test.json',
      autoload: false
    });

    let settingAName = 'option-a';
    let settingAValue = 3;
    let settingBName = 'option-b';
    let settingBValue = new Date();

    let allData = {};
    allData[settingAName] = settingAValue;
    allData[settingBName] = settingBValue;

    store._data = allData;

    expect(store.get(settingBName)).toBe(settingBValue);    
    expect(store.get(settingAName)).toBe(settingAValue);
  });

  it('should not override falsey values with default values', () => {
    let settingName = 'minimizeToTray';
    let expectedValue = false;
    let unexpectedValue = true;

    let defaults = {};
    defaults[settingName] = unexpectedValue;

    let store = new JsonStore({
      filename: 'test.json',
      defaults
    });

    store._data = {};
    store._data[settingName] = expectedValue;

    let actualValue = store.get(settingName);

    expect(actualValue).toBe(expectedValue);
  });  

  it('should return defaults if values are not defined', () => {
    let settingName = 'setting';
    let expectedValue = 'remote';

    let defaults = {};
    defaults[settingName] = expectedValue;

    let store = new JsonStore({
      filename: 'test.json',
      defaults
    });

    store._data = {};   

    let actualValue = store.get(settingName);

    expect(actualValue).toBe(expectedValue);
  });
});