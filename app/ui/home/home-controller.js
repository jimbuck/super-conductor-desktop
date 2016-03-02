
(() => {
  
  angular.module('SuperConductor').controller('HomeCtrl', HomeCtrl);
  
  HomeCtrl.$inject = ['$rootScope', '$scope'];
  
  function HomeCtrl($rootScope, $scope) {

    $rootScope.title = 'Dashboard';
    
    $scope.connections = [];
    $scope.recentEvents = [];
    $scope.networkData = {};
  }
  
})();