'use strict'

angular.
  module('renderApp').
  config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider) {

      $stateProvider
        .state('home', {
          url: '/',
          controller: 'HomeController',
          templateUrl: 'app/home/home.template.html'
        })
        .state('renders',{
          url: '/renders',
          component: 'renders'
        })
        .state('uis', {
          url: '/api/v1/uis',
          component: 'renderList'
        })
        .state('uis.render', {
          url: '/:model/:view/:ctrl',
          controllerProvider: function ($stateParams) {
            const ctrl = $stateParams.ctrl.split('.')[0];
            return ctrl;
          },
          templateUrl: function ($stateParams) {
            const view = $stateParams.view;
            const model = $stateParams.model;
            return 'app/uis/' + model + '/' + view;
          }
        })
        .state('add', {
          url: '/add',
          component: 'add'
        });

      $urlRouterProvider.otherwise('/');
      console.log("App Initialized");

    }

  ])
