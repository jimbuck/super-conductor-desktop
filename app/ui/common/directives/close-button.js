
(() => {
  
  angular.module('SuperConductor').directive('scCloseButton', closeButtonFactory);
  
  closeButtonFactory.$inject = [];
  
  function closeButtonFactory() {
    return {
      restrict: 'E',
      replace: true,
      template: '<button type="button" class="close">&times;</button>'
    }
  }
  
})();