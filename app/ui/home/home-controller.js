
(() => {
  
  angular.module('SuperConductor').controller('HomeCtrl', HomeCtrl);
  
  HomeCtrl.$inject = ['$scope'];
  
  function HomeCtrl($scope) {

    $scope.title = 'Home';
    
    $scope.connections = [];
    $scope.recentEvents = [];
    $scope.networkData = {};
  }
  
})();