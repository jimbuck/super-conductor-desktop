
(() => {
  
  angular.module('SuperConductor').controller('SettingsCtrl', SettingsCtrl);
  
  SettingsCtrl.$inject = ['$rootScope', '$scope'];
  
  function SettingsCtrl($rootScope, $scope) {
    $rootScope.title = 'Settings';
  }
  
})();