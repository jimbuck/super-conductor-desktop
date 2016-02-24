
(() => {
  
  angular.module('SuperConductor').controller('MenuCtrl', MenuCtrl);
  
  MenuCtrl.$inject = ['$scope'];
  
  function MenuCtrl($scope) {
    $scope.title = 'Menu';
  }
  
})();