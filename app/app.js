
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import env from './env';

import fs from 'fs';

import WebSocket from 'ws';
import logger from './logging/logger';
import BrowserConsoleLogger from './logging/browser-console-transport';
import * as models from './models/models';
import appData from './utils/app-data';

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

superConductor.constant('app', app);             // Electron
superConductor.constant('env', env);             // Electron
superConductor.constant('appData', appData);     // Electron
superConductor.constant('jetpack', jetpack);     // fs-jetpack
superConductor.constant('WebSocket', WebSocket); // ws
superConductor.constant('logger', logger);       // Winston

debugger;

// Inject each model separately...
superConductor.constant('Setting', models.Setting);

superConductor.constant('pages', [
  { name: 'Dashboard', url: '/', icon: 'glyphicon-dashboard', templateUrl: './ui/home/home.html', controller: 'HomeCtrl' },
  { name: 'Rules', url: '/rules', icon: 'glyphicon-flash', templateUrl: './ui/rules/rules.html', controller: 'RulesCtrl' },
  { name: 'Clients', url: '/clients', icon: 'glyphicon-transfer', templateUrl: './ui/clients/clients.html', controller: 'ClientsCtrl' },
  { name: 'Logs', url: '/logs', icon: 'glyphicon-list-alt', templateUrl: './ui/logs/logs.html', controller: 'LogsCtrl' },
  { name: 'Settings', url: '/settings', icon: 'glyphicon-cog', templateUrl: './ui/settings/settings.html', controller: 'SettingsCtrl' },
  { name: 'About', url: '/about', icon: 'glyphicon-question-sign', templateUrl: './ui/about/about.html', controller: 'AboutCtrl' }
]);

superConductor.controller('RootCtrl', RootCtrl);

RootCtrl.$inject = ['$scope'];

function RootCtrl($scope) {
  $scope.closeWindow = function() {
    // TODO: Confirm close if data has been edited...
    window.close();
  }
}

superConductor.config(configFactory);

configFactory.$inject = ['$routeProvider', '$httpProvider', 'pages'];

function configFactory($routeProvider, $httpProvider, pages) {

  // Performance boost!  
  $httpProvider.useApplyAsync(true);

  // Routes...
  pages.forEach(page => {
    $routeProvider.when(page.url, page);
  });
  
  // Default to first entry...
  $routeProvider.otherwise(pages[0].url);

}