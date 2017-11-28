'use strict'

angular
      .module("renderList")
      .component("renderList", {
            templateUrl: 'js/render-list/render-list.template.html',
            controller: ["$scope", "$http", function ($scope, $http) {
                  console.log("Render List Controller initialized");

                  $scope.myValue=false;
                  $scope.model="test";
                  $scope.view="hola.template.html";
                  $scope.ctrl="hola.component.js";
                  
            }]
      });
