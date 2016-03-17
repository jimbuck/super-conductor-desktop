import path from 'path';

import * as _ from 'lodash';

import { app, BrowserWindow, Tray, Menu } from 'electron';
import logger from './logging/logger';

import localShortcut from 'electron-localshortcut';
import jetpack from 'fs-jetpack';

import appData from './utils/app-data';
import devHelper from './vendor/electron_boilerplate/dev_helper';
import windowStateKeeper from './vendor/electron_boilerplate/window_state';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

import Server from './comms/server';

import {settings} from './utils/settings-manager.js';

let appUrl;

if (env.name === 'test') {
  appUrl = 'file://' + __dirname + '/spec.html';
} else {
  appUrl = 'file://' + __dirname + '/app.html';
}

let mainWindow;
let tray;

// Preserver of the window size and position between app launches.
let mainWindowState = windowStateKeeper('main', {
  width: 1000,
  height: 600
});

app.on('window-all-closed', function() {

  if (env.name === 'test') {
    app.quit();
    return;
  }

  // Refresh the settings (since the user may have changed them)
  settings.load();
  
  if (settings.minimizeToTray) {
    // Just let the app run in the tray...
    showTrayIcon(); 
  } else {    
    app.quit();   
  }
});

app.on('ready', function() {
  if (env.name === 'test') {
    openWindow();
    return;
  }

  if (settings.openAtStartup || !settings.minimizeToTray) {
    openWindow();
  } else {
    showTrayIcon();
  }
});

function showTrayIcon() {

  if (tray || !settings.minimizeToTray) {
    return;
  } 

  tray = new Tray(path.join(__dirname, '/content/tray.png'));
  
  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open...',
      click: () => { openWindow(); }
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Run on Start Up',
          type: 'checkbox',
          checked: settings.runAtStartup,
          click: (menuItem) => {
            settings.runAtStartup = menuItem.checked;
          }
        },
        {
          label: 'Restrict to localhost',
          type: 'checkbox',
          checked: settings.restrictToLocalhost,
          click: (menuItem) => {
            settings.restrictToLocalhost = menuItem.checked;
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'All Settings...',
          click: (menuItem) => {
            openWindow('/settings');
          }
        }
      ]
    },
    {
      type: 'separator'
    },
    {
      label: 'Exit',
      click: () => app.quit()
    }
  ]);

  tray.setToolTip('SuperConductor');
  tray.setContextMenu(contextMenu);
  // Allow left click to also open the tray menu...  
  tray.on('click', () => openWindow());
}

function openWindow(path) {

  path = '#' + (path || '/');
  
  if (mainWindow) {
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minHeight: 720,
    minWidth: 960,
    show: false,
    darkTheme: true,
    frame: env.name === 'test'
  });  

  // Disable the menu bar...
  Menu.setApplicationMenu(null);

  // Register the "Refresh" command...
  localShortcut.register(mainWindow, 'CmdOrCtrl+R', () => {
    BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
  });

  // Register the "Toggle Fullscreen" command...
  localShortcut.register(mainWindow, 'F11', () => {
    let window = BrowserWindow.getFocusedWindow();
    window.setFullScreen(!window.isFullScreen());
  });

  // Register the "Toggle DevTools" command...
  localShortcut.register(mainWindow, 'CmdOrCtrl+Shift+J', () => {
    BrowserWindow.getFocusedWindow().toggleDevTools();
  });

  // Register the "Quit" command...
  localShortcut.register(mainWindow, 'CmdOrCtrl+Q', () => {
    app.quit();
  });

  mainWindow.webContents.on('did-finish-load', function() {

    // Hide the tray...    
    if (tray) {
      tray.destroy();
      tray = null;
    }

    mainWindow.show();

    if (mainWindowState.isMaximized) {
      mainWindow.maximize();
    }

    if (env.name !== 'production') {
      mainWindow.openDevTools();
    }
  });

  const saveWindowState = _.debounce((e) => {
    mainWindowState.saveState(mainWindow);
    logger.debug('Saved window state!');
  }, 500);

  mainWindow.on('resize', saveWindowState);
  mainWindow.on('move', saveWindowState);
  mainWindow.on('close', () => {
    mainWindowState.saveState(mainWindow);
    mainWindow = null;
  });

  mainWindow.loadURL(appUrl + path);
}

// Create the communications server....
let server = new Server();

server.listen(3000);