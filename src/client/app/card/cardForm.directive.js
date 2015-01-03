angular
  .module('app.cart')
  .directive('cardForm',cardForm);

cardForm.$inject = ['userApi','conekta'];

function cardForm(userApi, conekta){
  return{
    restrict: 'EA',
    templateUrl: 'app/card/card.form.html',
    scope: true,
    link:function(scope,element,attr){
      scope.card = {name:'Javier Pedreiro',
                    number: '4242424242424242',
                    cvc: '123',
                    exp_month: '05',
                    exp_year: '2015'
                   };

      scope.saveCard = function(){
        conekta.saveCard(scope.currentUser.conektaId,scope.card).then(function(card){
          var newCard = {type:'card', card:card};
          if(scope.cards)
            scope.cards.push(newCard);
          scope.shoppingCart
            scope.shoppingCart.paymentMethod = newCard;

          scope.showCardForm(false);

          console.log(scope.cards);
        },function(error){
          if(error.status)
            console.error('status: '+error.status+', statusText: '+error.statusText+', error: '+error.data.error);
          else
            console.error(error);
        });
      };
    }
  }
}