'use strict'

angular
      .module("test")
      .component("test", {
            templateUrl: 'js/test/test.template.html',
            controller: ["$scope", "$http", function ($scope, $http) {

            }]
        });