
(() => {
  
  angular.module('SuperConductor').controller('HomeCtrl', HomeCtrl);
  
  HomeCtrl.$inject = ['$scope'];
  
  function HomeCtrl($scope) {

    $scope.title = 'Home';
    $scope.message = `Today is ${(new Date()).toDateString()}`;
    
    $scope.connections = [];
    $scope.recentEvents = [];
    $scope.networkData = {};
  }
  
})();