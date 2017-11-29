'use strict'

angular.
  module('renderApp').
  config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {
      
      $stateProvider
        .state('uis',{
          url: '/api/v1/uis'
        })
        .state('uis.render', {
          url: '/:model/:view/:ctrl',
          controllerProvider: function($stateParams){
            const ctrl = $stateParams.ctrl.split('.')[0];
            return ctrl;
          },
          templateUrl: function($stateParams){
            const view = $stateParams.view;
            const model = $stateParams.model;
            return 'js/'+model+'/'+view;
          }
        })
      console.log("App Initialized");

    }

  ])
