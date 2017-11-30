'use strict'

angular
      .module("add")
      .component("add", {
            templateUrl: 'app/add/add.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Add Controller initialized");

                  var baseURL = "/api/v1/uis";

                  $scope.add = function (model, view, ctrl) {
                        console.log("Inserting data...");
                        var data = '{"uid":"' + model + '","options":[{ "view":"' + view + '","ctrl":"' + ctrl + '"}]}';
                        $http
                              .post(baseURL, data)
                              .then(function (response) {
                                    $scope.myValue = false;
                                    $state.go("uis");
                              }, function (err) {
                                    if (err.status != 201) {
                                          $scope.myValue = true;
                                          $scope.error = err.status + " " + err.statusText;
                                    }
                              });
                  };
            }]
      });