
(() => {
  
  angular.module('SuperConductor').controller('ClientsCtrl', ClientsCtrl);
  
  ClientsCtrl.$inject = ['$rootScope', '$scope'];
  
  function ClientsCtrl($rootScope, $scope) {
    $rootScope.title = 'Clients';
  }
  
})();