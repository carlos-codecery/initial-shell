(function() {
  'use strict';

  angular
  .module('app.cart')
  .controller('Checkout', Checkout);

  Checkout.$inject = ['$scope', '$state','ShoppingCart', 'userApi'];

  function Checkout($scope, $state,ShoppingCart, userApi) {

    var shell = $scope.shell;
    var checkout = this;

    $scope.$watch('shell.currentUser',function(){
      if(shell.currentUser){
        console.log('shell.currentUser', shell.currentUser.membership);
        shell.shoppingCart.membership = shell.currentUser.membership;
        shell.shoppingCart.userWallet = shell.currentUser.wallet;
        ShoppingCart.setCart(shell.shoppingCart);
      }
    });

    checkout.addresses = [];
    checkout.paymentMethods = [];
    checkout.itemsUnavailable = [];
    checkout.completed = false;
    checkout.updateCart = false;
    checkout.loginFormsView = false;
    checkout.walletView = false;
    

    shell.shoppingCart = ShoppingCart.getCart();

    if(!shell.currentUser){
      if(shell.shoppingCart.wallet){
        shell.shoppingCart.wallet = 0;
        shell.shoppingCart.useWallet = false;
        shell.shoppingCart.userWallet = 0;
        ShoppingCart.setCart(shell.shoppingCart);
      }
    }

    resetViews();

    checkout.updateWallet = function(cart){
      shell.shoppingCart = cart;
    }

    checkout.setStatus = function(status){
      checkout.completed = status;
    }

    checkout.goToCart =  function(){
      resetViews();
    }

    checkout.toAddress = function(){
      checkout.showAddress = true;

      if(!checkout.loadAddress)
        checkout.loadAddress = true;

      checkout.walletView = false;
      checkout.showPayment = false;
      checkout.showPlaceOrder = false;
    }

    checkout.toPaymentMethod = function(){

      ShoppingCart.setCart(shell.shoppingCart);
      checkout.showPayment = true;
      if(!checkout.loadPayment)
        checkout.loadPayment = true;

      checkout.showPlaceOrder = false;
    }

    checkout.toConfirmOrder = function(){
      ShoppingCart.setCart(shell.shoppingCart);
      checkout.showPlaceOrder = true;
    }

    checkout.emptyCart = function(){
      shell.shoppingCart = ShoppingCart.emptyCart();
      resetViews();
    }

    checkout.cleanItemsUnavaibale = function(){
      cleanItemsUnavaibale();
    }

    checkout.showLoginForms = function(view){
      checkout.loginFormsView = view;
    }

    $scope.setUser= function(user){
      shell.currentUser= user;
      // checkout.showAddress = true;
    }

    checkout.removeFromCart = function(index){
      shell.shoppingCart = ShoppingCart.removeItem(index);
    }

    checkout.showWalletView =  function(){
      checkout.walletView = true;
    }

    checkout.hideWalletView =  function(){
      checkout.walletView = false;
    }

    checkout.setMethods = function(cards){
      checkout.paymentMethods = cards;
      console.log(checkout.paymentMethods);
    }

    function resetViews(){
      checkout.showAddress = false;
      checkout.showPayment = false;
      checkout.showPlaceOrder = false;
      checkout.showConfirmation = false;
    }

    function cleanItemsUnavaibale(){
      checkout.itemsUnavailable = [];
    }  


  }

})();
