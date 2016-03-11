

(() => {

  angular.module('SuperConductor').factory('modalManager', modalManagerFactory);

  modalManagerFactory.$inject = ['$rootScope','$uibModal'];

  function modalManagerFactory($rootScope, $modal) {

    let modalManager = {};

    modalManager.open = function(opts) {
      return $modal.open(opts).result;
    }

    modalManager.confirm = function(title, message) {
      
      let modalScope = $rootScope.$new();
      modalScope.title = title;
      modalScope.message = message;

      return modalManager.open({
        templateUrl: './ui/common/modal-manager/confirm.html',
        scope: modalScope,
        size: 'md',
        backdrop: 'static',
        keyboard: false
      });
    };

    modalManager.alert = function(title, message) {
      let modalScope = $rootScope.$new();
      modalScope.title = title;
      modalScope.message = message;

      return modalManager.open({
        templateUrl: './ui/common/services/modal-manager/alert.html',
        scope: modalScope,
        size: 'md',
        backdrop: 'static',
        keyboard: false
      });
    };

    modalManager.prompt = function(opts) {
      throw new Error('Not yet implemented!');
    };

    modalManager.chooseFile = function(opts) {
      throw new Error('Not yet implemented!');
    };    

    return modalManager;
  }

})();