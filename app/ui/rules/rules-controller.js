
(() => {
  
  angular.module('SuperConductor').controller('RulesCtrl', RulesCtrl);
  
  RulesCtrl.$inject = ['$scope'];
  
  function RulesCtrl($scope) {
    $scope.title = 'Rules';
  }
  
})();