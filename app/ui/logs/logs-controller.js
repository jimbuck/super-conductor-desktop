
(() => {
  
  angular.module('SuperConductor').controller('LogsCtrl', LogsCtrl);
  
  LogsCtrl.$inject = ['$scope'];
  
  function LogsCtrl($scope) {
    $scope.title = 'Logs';
  }
  
})();