
import path from 'path';
import jetpack from 'fs-jetpack';
import appData from '../utils/app-data';

export default class JsonStore
{
  constructor(opts) {
    opts = opts || {};
    
    if (typeof opts === 'string') {
      opts = { filename: opts }
    }
    
    if (!opts.filename) throw new Error(`'filename' must be specified!`);

    this.filename = appData.path(opts.filename);
    this.defaults = opts.defaults || {};    
    this._fs = opts._fs || jetpack;

    if (opts.autoload !== false) {
      this.load();
    }
  }

  load() {
    this._data = this._fs.read(this.filename, 'jsonWithDates') || {};
  }  
  
  get(key) {
    if (typeof key === 'string') {
      return this._data.hasOwnProperty(key) ? this._data[key] : this.defaults[key];
    }

    return this._data || this.defaults;
  }
  
  set(key, value) {
    if (!key) throw new Error(`'key' must be specified!`);

    if (typeof key === 'string') {
      this._data[key] = value;
      console.log(`JSON-STORE:: Set ${key} to ${value}`);
    } else if(typeof key === 'object') {
      this._data = key;
      console.log(`JSON-STORE:: Set data to %o`, key); 
    } else {
      throw new Error(`'key' must be either a string and value or object hash of properties!`);
    }

    this._save();    
  }
  
  del(key) {
    if (typeof key !== 'string') throw new Error(`'key' must be specified!`);
    
    delete this._data[key];

    this._save();    
  }

  _save() {
    return this._fs.write(this.filename, this._data, { atomic: true });
  }
}