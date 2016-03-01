
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import env from './env';

import fs from 'fs';

import WebSocket from 'ws';
import logger from './logging/logger';
import BrowserConsoleLogger from './logging/browser-console-transport';

// Required for logs to show up in devtools.
logger.add(BrowserConsoleLogger);

logger.debug('Loaded environment variables:', env);

let app = remote.app;
let appDir = jetpack.cwd(app.getAppPath());

let packageJson = appDir.read('package.json', 'json');

// Create the app module.
let superConductor = angular.module('SuperConductor', [
  'ngAnimate',
  'ngRoute',
  'ngResource',
  'ui.bootstrap'
]);

superConductor.constant('app', app);
superConductor.constant('env', env);
superConductor.constant('fs', fs);
superConductor.constant('WebSocket', WebSocket);
superConductor.constant('logger', logger);

superConductor.config(configFactory);

configFactory.$inject = ['$routeProvider', '$httpProvider'];

function configFactory($routeProvider, $httpProvider) {

  // Performance boost!  
  $httpProvider.useApplyAsync(true);

  // Routes  
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
    .when('/logs', {
      templateUrl: './ui/logs/logs.html',
      controller: 'LogsCtrl'
    })
    .when('/help', {
      templateUrl: './ui/help/help.html',
      controller: 'HelpCtrl'
    })
    .otherwise('/');

}