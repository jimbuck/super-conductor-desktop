
(() => {
  
  angular.module('SuperConductor').controller('HomeCtrl', HomeCtrl);
  
  HomeCtrl.$inject = ['$scope'];
  
  function HomeCtrl($scope) {
    $scope.message = `Today is ${(new Date()).toDateString()}`;
  }
  
})();