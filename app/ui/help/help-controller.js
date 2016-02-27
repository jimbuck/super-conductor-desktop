
(() => {
  
  angular.module('SuperConductor').controller('HelpCtrl', HelpCtrl);
  
  HelpCtrl.$inject = ['$rootScope', '$scope'];
  
  function HelpCtrl($rootScope, $scope) {
    $rootScope.title = 'Help';
  }
  
})();