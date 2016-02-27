'use strict';

(() => {
  
  let app = angular.module('SuperConductor');
  
  app.controller('MenuCtrl', menuCtrlFactory);
  
  menuCtrlFactory.$inject = ['$scope', '$window', 'logger', 'app'];
  
  function menuCtrlFactory($scope, $window, logger, app) {
    
    $scope.links = [
      { name: 'Dashboard', url: '#/', icon: 'glyphicon-dashboard' },
      { name: 'Rules', url: '#/rules', icon: 'glyphicon-flash'  },
      { name: 'Logs', url: '#/logs', icon: 'glyphicon-list-alt' },
      { name: 'Settings', url: '#/settings', icon: 'glyphicon-cog' },
      { name: 'Help', url: '#/help', icon: 'glyphicon-question-sign' }
    ];
    
    $scope.$on('$routeChangeSuccess', function(event, next, current) {      
      $scope.links.forEach(link => {
        link.isActive = ($window.location.hash === link.url);
      });
    });
    
    $scope.exit = () => {
      app.quit();
    };
  }
  
  app.directive('scMenu', menuFactory);
  
  menuFactory.$inject = [];
  
  function menuFactory() {
    
    return {
      restrict: 'E', //E = element, A = attribute, C = class, M = comment         
      scope: {
        title: '@' //@ reads attribute value, = provides two-way binding, & works w/ functions
      },
      templateUrl: './ui/menu/menu.html',
      controller: 'MenuCtrl'
    };
  }
  
})();