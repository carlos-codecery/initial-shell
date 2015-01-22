(function() {
  'use strict';

  angular
  .module('app.storage')
  .service('Message', Message);

  Message.$inject = [];

  function Message() {
    this.currentValue = false;
    this.showModal = false;
    this.question =  '¿Deses ejecutar esta acción?';

    this.setValue = function(newValue){
      this.currentValue = newValue;
    }

    this.setModal = function(newValue){
      this.showModal = newValue;
    }

    this.setQuestion = function(question){
      this.question = question;
    }


  }
})();
