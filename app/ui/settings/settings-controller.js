
(() => {
  
  angular.module('SuperConductor').controller('SettingsCtrl', SettingsCtrl);
  
  SettingsCtrl.$inject = ['$rootScope', '$scope', 'modalManager'];
  
  function SettingsCtrl($rootScope, $scope, modalManager) {

    $rootScope.title = 'Settings';

    $scope.settings = {
        connectionPort: 6014,
        runAtStartup: true,
        restrictToLocalhost: false,
        minimizeToTray: true
      }; //SettingsManager.load();
    
    const originalValues = angular.copy($scope.settings);
    
    $scope.save = function(form) {    

      console.log($scope.settings);
      
      //SettingsManager.save($scope.settings);
    }

    $scope.cancel = function() {
      $scope.settings = angular.copy(originalValues);
    }    

    $scope.resetToDefaults = function() {

      modalManager.confirm('Reset to Defaults', 'Would you like to reset all settings to thier default values? This will undo any changes that have been made.').then(reset => {
        if (reset) {
          $scope.settings = angular.copy(originalValues);
        }
      });
    }   
  }
  
})();