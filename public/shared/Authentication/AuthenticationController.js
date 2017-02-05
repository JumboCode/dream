angular.module('dreamApp.authentication').controller('AuthenticationController', ['$scope', '$state', 'AuthenticationService', 
  function ($scope, $state, AuthenticationService) {
    console.log('in AuthenticationController, state: ', $state.current.name);

    $scope.elem = "hi";
    $scope.reserror = '';

    $scope.login = function(user) {
      console.log(user);
      AuthenticationService.login(user, function(response) {
		// save firebase auth token
		if (response.success){
			console.log(response.token)
			window.sessionStorage.authToken = response.token;
			$state.go('root')

		} else {
			$scope.reserror = response.error;
		}
      });
    }

    $scope.register = function(user) {
      console.log(user);
      AuthenticationService.register(user, function(response) {
        if (!response.success){
			$scope.reserror = response.error;
		}
      });
    }

    $scope.deleteuser = function(user) {
      console.log(user);
      AuthenticationService.deleteuser(user, function(response) {
        if (response.status != 200)
        	$scope.reserror = response;
      });
    }

    $scope.changePassword = function(user) {
      console.log(user);
      AuthenticationService.changePassword(user, function(response) {
        if (!response.success)
        	$scope.reserror = response.error;
			console.log($scope.reserror)
      });
    }

    $scope.changeEmail = function(user) {
      console.log(user);
      AuthenticationService.changeEmail(user, function(response) {
        if (!response.success){
			$scope.reserror = response.error;
		}
      });
    }

    $scope.resetPassword = function(user) {
      console.log(user);
      AuthenticationService.resetPassword(user, function(response) {
        if (!response.success){
			$scope.reserror = response.error;
			console.log($scope.reserror)
		}
      });
    }

  }
]);