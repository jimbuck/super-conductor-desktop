
(() => {
  
  angular.module('SuperConductor').controller('HomeCtrl', HomeCtrl);
  
  HomeCtrl.$inject = ['$rootScope', '$scope'];
  
  function HomeCtrl($rootScope, $scope) {

    $rootScope.title = 'Home';
    
    $scope.connections = [];
    $scope.recentEvents = [];
    $scope.networkData = {};
  }
  
})();