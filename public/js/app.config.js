'use strict'

angular.
  module('renderApp').
  config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider
      .when("/api/v1/uis/:model/:view/:ctrl", {
        templateUrl: "js/test/test.template.html"
      })
      .otherwise("/");
    console.log("App initialized");
  }
]);
