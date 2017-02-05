angular.module('dreamApp.nav_top').controller('NavTopController', ['$scope', 'AuthenticationService', '$http',
  function ($scope, AuthenticationService,$http) {
    console.log('in NavTopController');

    $scope.user;
    $scope.email;
    AuthenticationService.getUser(function(data) {
      $scope.user = data;
      $scope.email = data.email;

    });
    
	$scope.promise = $http.get('/isChair', { params:{ user:window.sessionStorage.authToken} })
	
	$scope.promise.then(function successCallback(response) {
		$scope.isChair = response.data;
		console.log(response)
	}, function errorCallback(response) {
	});
	  
    $scope.logout = function() {
      AuthenticationService.logout();
    };

    }
]);