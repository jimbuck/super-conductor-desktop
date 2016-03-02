// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';

import { app, BrowserWindow, Tray, Menu } from 'electron';
import logger from './logging/logger';

import localShortcut from 'electron-localshortcut';

import devHelper from './vendor/electron_boilerplate/dev_helper';
import windowStateKeeper from './vendor/electron_boilerplate/window_state';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

import Server from './comms/server';

let mainWindow;
let tray;

// Preserver of the window size and position between app launches.
let mainWindowState = windowStateKeeper('main', {
    width: 1000,
    height: 600
});

app.on('window-all-closed', function () {
  if (env.name === 'test') {
    app.quit();
  } else {
    // Don't do anything, to prevent the app from stopping...
  }
});

app.on('ready', function () {

  if (env.name !== 'production') {
    openWindow();
    if(env.name === 'test') return;
  }
  
  tray = new Tray(path.join(__dirname, '/content/tray.png'));
  
  let contextMenu = Menu.buildFromTemplate([
    { label: 'Open...', click: openWindow },
    { label: 'Settings', submenu:[
        { label: 'Run on Start Up', type: 'checkbox', checked: false },
        { label: 'Restrict to localhost', type: 'checkbox', checked: true },
        { type: 'separator' },
        { label: 'All Settings...', click: openWindow }
      ]
    },
    { type: 'separator' },
    { label: 'Exit', click: () => {
        app.quit(); 
      }
    }
  ]);
  
  tray.setToolTip('SuperConductor');
  tray.setContextMenu(contextMenu);
  // Allow left click to also open the tray menu...  
  tray.on('click', () => openWindow());
});

function openWindow(path) {  
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
    frame: false
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
    mainWindow.show();

    if (mainWindowState.isMaximized) {
      mainWindow.maximize();
    }
    
    if (env.name !== 'production') {
      mainWindow.openDevTools();
    }
  });

  mainWindow.on('close', () => {
    mainWindowState.saveState(mainWindow);
    mainWindow = null;
  });

  if (env.name === 'test') {
    mainWindow.loadURL('file://' + __dirname + '/spec.html');
  } else {
    mainWindow.loadURL('file://' + __dirname + '/app.html');
  }
}

// Create the communications server....
let server = new Server();

server.listen(3000);