'use strict'

angular
      .module("navbar")
      .component("navbar", {
            templateUrl: 'js/navbar/navbar.template.html',
            controller: ["$scope", "$http", function ($scope, $http) {
                  console.log("Navbar Controller initialized");

            }]
        });