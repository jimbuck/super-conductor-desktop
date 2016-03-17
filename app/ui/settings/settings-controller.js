
(() => {
  
  angular.module('SuperConductor').controller('SettingsCtrl', SettingsCtrl);
  
  SettingsCtrl.$inject = ['$rootScope', '$scope', 'modalManager', 'settings'];
  
  function SettingsCtrl($rootScope, $scope, modalManager, settings) {

    $rootScope.title = 'Settings';

    $rootScope.hasUnsavedChanges = false;     

    $scope.settings = angular.copy(settings.all);
    
    const originalValues = angular.copy($scope.settings);
    
    $scope.save = function() {
      settings.save($scope.settings);

      $rootScope.hasUnsavedChanges = false;      

      // TODO: Display success!      
    };

    $scope.onChange = function(key) {
      $rootScope.hasUnsavedChanges = true;

      switch (key) {
        case 'minimizeToTray':
          if (!$scope.settings.minimizeToTray) {
            $scope.settings.openAtStartup = true;
          }
          break;          
      }
    }    

    $scope.cancel = function() {
      $scope.settings = angular.copy(originalValues);
      $rootScope.hasUnsavedChanges = false;
    };

    $scope.resetToDefaults = function() {

      modalManager.confirm('Reset to Defaults', 'Would you like to reset all settings to thier default values? This will undo any changes that have been made.').then(reset => {
        if (reset) {
          $scope.settings = angular.copy(settings.defaults);
          $scope.save();
        }
      });
    };   
  }
  
})();