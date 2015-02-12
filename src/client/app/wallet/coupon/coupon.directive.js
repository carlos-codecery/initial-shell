angular
  .module('app.dashboard')
  .directive('coupon',coupon);

coupon.$inject = ['couponApi','userApi'];

function coupon(couponApi, userApi){
  return{
    restrict: 'EA',
    scope: true,
    templateUrl: 'app/wallet/coupon/coupon.form.html',
    link:function(scope, element, attribute){
      scope.redeemCode = function(){
        var shell = scope.shell;

        scope.error = false;
        scope.success = false;

        if(scope.couponForm.$valid){
          shell.showLoading();
          couponApi.redeemCode(scope.coupon.code, userApi.currentUser().objectId).then(function(result){
            var coupon = result.result;
            scope.success = "Codigo valido";
            shell.updateCurrentUser();
            if(shell.shoppingCart){
              shell.shoppingCart.userWallet += coupon.amount;
            }
          },function(error){
            shell.setError(error);
          }).finally(shell.hideLoading);
        }
      }
    }
  }
}