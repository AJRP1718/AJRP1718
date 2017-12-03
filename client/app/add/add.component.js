'use strict'

angular
      .module("add")
      .component("add", {
            templateUrl: 'app/add/add.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Add Controller initialized");

                  var baseURL = "/api/v1/uis";

                  $scope.add = function () {
                        console.log("Inserting data...");
                        var viewFile = (document.getElementById('viewFile')).files[0];
                        var ctrlFile = (document.getElementById('ctrlFile')).files[0];
                        if (!viewFile || !ctrlFile) {
                              $scope.myValue = true;
                              $scope.error = "400 Bad Request";
                        } else if (viewFile.name.split('.')[0] != ctrlFile.name.split('.')[0]) {
                              $scope.myValue = true;
                              $scope.error = "It must be " + viewFile.name.split('.')[0] + ".controller.js";
                        } else if (viewFile.name.split('.')[1] + "." + viewFile.name.split('.')[2] != "template.html") {
                              $scope.myValue = true;
                              $scope.error = "It must be " + viewFile.name.split('.')[0] + ".template.html";
                        } else if (ctrlFile.name.split('.')[1] + "." + ctrlFile.name.split('.')[2] != "controller.js") {
                              $scope.myValue = true;
                              $scope.error = "It must be " + ctrlFile.name.split('.')[0] + ".controller.js";
                        } else {
                              var model = viewFile.name.split('.')[0];
                              var data = '{"uid":"' + model + '","options":[{ "view":"' + viewFile.name + '","ctrl":"' + ctrlFile.name + '"}]}';
                              const reader = new FileReader();
                              reader.onload = () => {
                                    let text = reader.result;
                                    var lines = text.split("\n").toString();
                                    if (!lines.includes(".module('renderApp')")) {
                                          $scope.myValue = true;
                                          $scope.error = ctrlFile.name+" must include .module('renderApp')";
                                          $scope.$apply();
                                    }
                                    else if (!lines.includes(".controller('" + model + "',")) {
                                          $scope.myValue = true;
                                          $scope.error = ctrlFile.name+" must include .controller('" + model + "', function...";
                                          $scope.$apply();
                                    } else {
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
                                    }

                              };
                              reader.readAsText(ctrlFile);

                        }
                  };
            }]
      });