
(() => {
  
  angular.module('SuperConductor').controller('HelpCtrl', HelpCtrl);
  
  HelpCtrl.$inject = ['$scope'];
  
  function HelpCtrl($scope) {
    $scope.title = 'Help';
  }
  
})();