(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('conekta', conekta);

  conekta.$inject = ['userApi','$q', 'parse','parseheaders'];

  /* @ngInject */
  function conekta(userApi, $q, parse, parseheaders) {
    var conketaPublicKey = parseheaders.conektaKeys.public;
    var  conektaResource  = parse.newCloudCodeResource(parseheaders.storeKeys);

    return conekta = {
      saveCard : saveCard,
      deleteCard : deleteCard,
      updateMembership: updateMembership,
      subcribe: subscribe,
      unsubscribe: unsubscribe,
      subscriptionCard: subscriptionCard,
      getPlan : getPlan 
    }

    function updateMembership(membership, payment, user){
      var membershipStatus = null;
      var nextBilling = null;
      return subscribe(membership.id, payment.card.id, user).then(function(result){
        if(result.result){
          if(result.result.status)
            membershipStatus = result.result.status;
          if(result.result.billing_cycle_end){
            nextBilling = result.result.billing_cycle_end;
            nextBilling = new Date(nextBilling* 1000);
            nextBilling = moment(nextBilling).subtract(6,'hours').locale('es').format('LL');
          }
        }

        var membershipActive = (membershipStatus === 'active')? true : false;
        return userApi.saveUserProfile({objectId: user.objectId, membership: membership.name , upgrade:'upgraded',subscriptionCard:payment,membershipActive:membershipActive, membershipStatus:membershipStatus, nextBilling:nextBilling});
      });
    }

    function getPlan(){
      return parseheaders.conektaKeys.planId;
    }

    function subscribe(plan, card, user){
      var params = {user: user,plan: plan, card: card, "function":"subscribe"}
      return conektaResource.save(params).$promise;
    }

    function unsubscribe(card, plan, message, user){

      if(!user)
        user = userApi.currentUser();
      
      var params = {user:user, plan: plan, "function":"unsubscribe"}
      return conektaResource.save(params).$promise.then(function(){
        return userApi.logMembership({user: user.objectId, status:'canceled',membershipStatus:'canceled',notes:{message:message}});
      }).then(function(){
        return userApi.saveUserProfile({objectId: user.objectId, membership: 'basic', membershipActive:false, membershipStatus:'canceled', upgrade:'canceled'});        
      });
    }

    function subscriptionCard(payment, user){
      var params = { user:user, card:payment.card.id, "function":"subscriptionCard"}
      return conektaResource.save(params).$promise.then(function(){
        return userApi.logMembership({user: user.objectId, status:'updateCard', notes:payment});
      }).then(function(){
        return userApi.saveUserProfile({objectId: user.objectId, subscriptionCard:payment});
      });
    }

    function deleteCard(conektaId, cardId){
      return userApi.deleteCard({conektaId:conektaId,cardId:cardId});
    }

    function saveCard(conektaId, card){
      var deferred = $q.defer();
      Conekta.setPublishableKey(conketaPublicKey);
      var errorResponseHandler,
          successResponseHandler,
          tokenParams;

      tokenParams = {card:card};

      successResponseHandler = function(token) {
        
        userApi.addCard({conektaId:conektaId, token:token.id}).then(function(result){
          deferred.resolve(result.result);
        },function(error){
          deferred.reject(error);
          console.error('status: '+error.status+', statusText: '+error.statusText+', error: '+error.data.error);
        });
      };

      errorResponseHandler = function(error) {
        deferred.reject(error)
      };

      Conekta.token.create(tokenParams, successResponseHandler, errorResponseHandler);
      return deferred.promise;

    }

  }
})();
