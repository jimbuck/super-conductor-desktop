
(() => {
  
  angular.module('SuperConductor').controller('AboutCtrl', AboutCtrl);
  
  AboutCtrl.$inject = ['$rootScope', '$scope'];
  
  function AboutCtrl($rootScope, $scope) {
    $rootScope.title = 'About';
  }
  
})();