'use strict'

angular
      .module('renderApp')
      .controller('example', function ($scope, $http) {
            console.log('Example Controller Initialized');
			
				$scope.value="Example Template!"
			
				$scope.change=function(){
					$scope.value="Example Template Works!";
				}
      });