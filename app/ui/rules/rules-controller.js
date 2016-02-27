
(() => {
  
  angular.module('SuperConductor').controller('RulesCtrl', RulesCtrl);
  
  RulesCtrl.$inject = ['$rootScope','$scope'];
  
  function RulesCtrl($rootScope, $scope) {
    $rootScope.title = 'Rules';
  }
  
})();