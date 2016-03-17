
import JsonStore from './json-store';

export class SettingsManager {
  constructor(defaults) {
    defaults = defaults || {};

    // Set up each property...    
    for (let prop in defaults) {
      if (!defaults.hasOwnProperty(prop)) continue;

      Object.defineProperty(this, prop, {
        get: function() {
          return this.storage.get(prop);
        },
        set: function(val) {
          return this.storage.set(prop, val);
        }
      });      
    }    
    
    this.storage = new JsonStore({
      filename: './settings.json',
      defaults: defaults
    });
  }

  load() {
    return this.storage.load();
  }

  get all() {
    return this.storage.get();
  }  

  save(settings) {
    return this.storage.set(settings);
  }
}

export const settings = new SettingsManager({
  connectionPort: 6014,
  runAtStartup: true,
  restrictToLocalhost: true,
  minimizeToTray: true,
  openAtStartup: true,
  enableBroadcast: true,
  sendUsageStatistics: true,
  showDevTools: false
});