
(() => {
  
  angular.module('SuperConductor').controller('SettingsCtrl', SettingsCtrl);
  
  SettingsCtrl.$inject = ['$scope'];
  
  function SettingsCtrl($scope) {
    $scope.title = 'Settings';
  }
  
})();