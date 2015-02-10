(function() {
  'use strict';

  angular
  .module('app.admin')
  .controller('Sales', Sales);

  Sales.$inject = ['$scope','salesApi'];

  function Sales($scope, salesApi) {
    var shell = $scope.shell;
    var sales = this;
    var today = new Date();
    sales.startDate = today;
    sales.endDate = today;
    sales.result = {};
    sales.list = [];

    shell.showLoading();
    salesApi.getSales().then(function(result){
      sales.result = result.result;

    },function(){
      shell.setError(error);
    }).finally(shell.hideLoading);

    sales.getSales = function(startDate, endDate){
      shell.showLoading();
      salesApi.getSales({startDate:startDate, endDate:endDate}).then(function(result){
        sales.result = result.result;
        console.log(result);
      },function(error){
        shell.setError(error);
      }).finally(shell.hideLoading)
    }

    $scope.$watch('sales.result.orders',function(){
      if(sales.result.orders && sales.result.orders.length > 0 ){
        var orders = sales.result.orders;
        var byTotal = {};
        var filtered = [];
        angular.forEach(orders, function(order){
          angular.forEach(order.items, function(item){
            if(item.objectId in byTotal){
              if(item.quantity)
                byTotal[item.objectId].quantity += item.quantity;
              if(item.quantity && item.price)
                byTotal[item.objectId].total += item.quantity*item.price;
            }else{
              if(item.quantity && item.price)
              var total = item.quantity*item.price;
              byTotal[item.objectId] = {item:item, quantity: item.quantity, total:total, price:item.price, type:item.type};
            }

          });
        });
        angular.forEach(byTotal, function(item){
          filtered.push(item);
        });

        sales.list = filtered;
      }
    });

  }

})();
