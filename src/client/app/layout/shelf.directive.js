// (function() {
//   'use strict';

angular
  .module('app.layout')
  .directive('shelf',shelf);

shelf.$inject = ['serieApi'];

function shelf(serieApi){
  return{
    restrict: 'EA',
    scope:{
      publisher : '@'
    },
    templateUrl: 'app/layout/shelf.template.html',
    controller:function($scope){
      $scope.vm = {};
      $scope.vm.suscribe =  $scope.$parent.suscribe;
    },
    link:function(scope,element,attr){
      var publisher = attr.publisher;
      scope.vm.title = publisher;
      serieApi.getSeries({publisher:publisher}).then(function(series){
        console.log(series.result);
        scope.vm.itemsList = series.result;
      },function(error){
        console.error('status: '+error.status+', statusText: '+error.statusText+', error: '+error.data.error);
      });
    }
  }
}

// });