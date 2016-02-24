// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import env from './env';

import fs from 'fs';

import logger from './logging/logger';
import WebSocket from 'ws';

window.logger = logger;

logger.info('Loaded environment variables:', env);

let app = remote.app;
let appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
let packageJson = appDir.read('package.json', 'json');

let superConductor = angular.module('SuperConductor', [
  'ngAnimate',
  'ngRoute',
  'ngResource',
  'ui.bootstrap'
]);


superConductor.constant('env', env);
superConductor.constant('fs', fs);
superConductor.constant('WebSocket', WebSocket);
superConductor.constant('logger', logger);


superConductor.config(configFactory);

configFactory.$inject = ['$routeProvider'];

function configFactory($routeProvider) {
  
  $routeProvider
    .when('/', {
      templateUrl: './ui/home/home.html',
      controller: 'HomeCtrl'
    })
    .when('/rules', {
      templateUrl: './ui/rules/rules.html',
      controller: 'RulesCtrl'
    })
    .when('/settings', {
      templateUrl: './ui/settings/settings.html',
      controller: 'SettingsCtrl'
    })
    .when('/log', {
      templateUrl: './ui/log/log.html',
      controller: 'LogCtrl'
    })
    .otherwise('/');
  
}