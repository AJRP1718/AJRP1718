'use strict'

angular
      .module("add")
      .component("add", {
            templateUrl: 'app/add/add.template.html',
            controller: ["$scope", "$http", function ($scope, $http) {
                  console.log("Add Controller initialized");

            }]
        });