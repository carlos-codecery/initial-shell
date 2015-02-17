// (function() {
//   'use strict';

angular
  .module('app.layout')
  .directive('shelf',shelf);

shelf.$inject = ['storeApi'];

function shelf(storeApi){
  return{
    restrict: 'EA',
    scope:{
      publisher : '@',
      store : '@'
    },
    templateUrl: 'app/layout/shelf.template.html',
    controller:function($scope){
      $scope.shell = $scope.$parent.shell
    },
    link:function(scope,element,attr){
      var shell = scope.shell;

      var publisher = attr.publisher;
      var store = attr.store;
      shell.title = publisher;
      scope.loading = true;
      scope.itemsList = [];
      storeApi.getItems({publisher:publisher, status:'active', function: store}).then(function(series){
        scope.itemsList = series.result;
      },function(error){
        shell.setError(error);
      }).finally(function(){
        scope.loading = false;
      });
    }
  }
}

// });