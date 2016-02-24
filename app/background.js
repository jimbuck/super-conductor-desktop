// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, BrowserWindow, Tray, Menu } from 'electron';
import devHelper from './vendor/electron_boilerplate/dev_helper';
import windowStateKeeper from './vendor/electron_boilerplate/window_state';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

//import Server from './server/server';

let mainWindow;
let tray;

// Preserver of the window size and position between app launches.
let mainWindowState = windowStateKeeper('main', {
    width: 1000,
    height: 600
});

app.on('window-all-closed', function () {
    // This must be overridden to prevent the app from stopping...
});

app.on('ready', function () {

  tray = new Tray(__dirname + '\\tray.png');
  
  let contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: openWindow },
    { label: 'Settings', submenu:[
      { label: 'Run on Start Up', type: 'checkbox', checked: false },
      { label: 'Restrict to localhost', type: 'checkbox', checked: true }
    ] },
    { type: 'separator' },
    { label: 'Exit', click: () => { app.quit(); } }
  ]);
  
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
  // Allow left click to also open the tray menu...  
  tray.on('click', () => openWindow());
});

function openWindow() {
  if (mainWindow) {
    mainWindow.focus();
    return;
  }
  
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height
  });

  if (mainWindowState.isMaximized) {
    mainWindow.maximize();
  }

  if (env.name === 'test') {
    mainWindow.loadURL('file://' + __dirname + '/spec.html');
  } else {
    mainWindow.loadURL('file://' + __dirname + '/app.html');
  }

  if (env.name !== 'production') {
    devHelper.setDevMenu();
    mainWindow.openDevTools();
  }

  mainWindow.on('close', () => {
    mainWindowState.saveState(mainWindow);
    mainWindow = null;
  });
}

// Create the express server....
//let server = new Server();

//server.listen(3000);