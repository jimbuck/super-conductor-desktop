
(() => {
  
  angular.module('SuperConductor').controller('LogCtrl', LogCtrl);
  
  LogCtrl.$inject = ['$scope'];
  
  function LogCtrl($scope) {
    $scope.title = 'Log';
  }
  
})();