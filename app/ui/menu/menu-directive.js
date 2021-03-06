'use strict';

(() => {
  
  let module = angular.module('SuperConductor');
  
  module.controller('MenuCtrl', menuCtrlFactory);
  
  menuCtrlFactory.$inject = ['$scope', '$window', 'logger', 'app', 'pages', 'modalManager'];
  
  function menuCtrlFactory($scope, $window, logger, app, pages, modalManager) {
    
    $scope.links = pages;
    
    $scope.$on('$routeChangeSuccess', function(event, next, current) {      
      $scope.links.forEach(link => {
        link.isActive = ($window.location.hash === '#' + link.url);
      });
    });
    
    $scope.exit = function(){
      $scope.$emit('exit');
    }
  }
  
  module.directive('scMenu', menuFactory);
  
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