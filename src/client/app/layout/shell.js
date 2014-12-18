(function() {
  'use strict';

  angular
    .module('app.layout')
    .controller('Shell',Shell);

  Shell.$inject = ['$scope','$state','userApi','serieApi'];

  function Shell($scope, $state, userApi, serieApi){
    // jshint validthis: true 
    var vm = this;
    vm.searchValue = null;
    vm.itemsList = [];
    vm.title = 'Resultados';
    vm.cartItems = 0;
    vm.currentUser  = userApi.currentUser();

    $scope.setCurrentUser = function(user){
      console.log('setCurrentUser');
      vm.currentUser = user;
    }

    $scope.getCurrentUser = function(){
      return vm.currentUser;
    }

    $scope.logout = function(){
      userApi.logout();
      vm.currentUser = null;
      $state.go('home');
    }

    vm.searchByName = function(){
      var params = {
        name: vm.searchValue
      }
      serieApi.getSeries(params).then(function(series){
        console.log(series.result);
        vm.itemsList = series.result;
      },function(error){
        console.error('status: '+error.status+', statusText: '+error.statusText+', error: '+error.data.error);
      });
    }

    $scope.suscribe = function(){
      alert('suscribe');
    }
  }

})();
