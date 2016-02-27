
(() => {
  
  angular.module('SuperConductor').controller('LogsCtrl', LogsCtrl);
  
  LogsCtrl.$inject = ['$rootScope','$scope'];
  
  function LogsCtrl($rootScope, $scope) {
    $rootScope.title = 'Logs';
  }
  
})();