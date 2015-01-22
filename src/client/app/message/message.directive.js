angular
  .module('app.dashboard')
  .directive('confirmMessage',confirmMessage);

confirmMessage.$inject = ['Message'];

function confirmMessage(Message){
  return{
    restrict: 'EA',
    scope: true,
    link:function(scope, element, attribute){

      scope.show= false;
      scope.onConfirm = false;


      scope.showModal = function(){
        Message.setOnConfirm(attribute.confirm);
        Message.setQuestion(attribute.question);
        Message.setModal(true);
      }

      if(attribute.question){
        Message.setQuestion(attribute.question);
      }

      scope.hideModal = function(){
        scope.onConfirm = 'hey listen';
        Message.setModal(false);
      }

      scope.$watch(
        function() {
          return Message.currentValue;
        },
        function() {
          if(Message.currentValue == true){
            console.log('viewer', 'Change detected, new object:', Message.currentValue);
            Message.setValue(false);
            alert(Message.onConfirm)
            // if(scope.onConfirm){
              // alert(scope.onConfirm);
              scope.$eval(Message.onConfirm);
            // }
          }
          // angular.copy(Message.currentObject, scope.show);
        },
        true // No need to be true
      );


    }
  }
}