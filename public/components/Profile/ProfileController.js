angular.module('dreamApp.profile').controller('ProfileController',ProfileController);

ProfileController.$inject = ['$scope','ProfileService','AuthenticationService'];

function ProfileController($scope,ProfileService,AuthenticationService) {
	// Init scope vars
	$scope.contacts = [];
	$scope.mentor = {};
	$scope.contacts = [];
	
	$scope.deleteUser = function(){
		AuthenticationService.deleteuser();
	}
	
	// This function removes null contacts so that it does not display empty information
	var removeNullContact = function(){
		var i=0;
		while( i<$scope.contacts.length ){
			if ($scope.contacts[i].name == undefined && $scope.contacts[i].phone == undefined)
				$scope.contacts.splice(i,1);
			else
				i++;
		}
	}
	
	// Query for the mentor profile information.
	$scope.promise = ProfileService.get_mentor_info(localStorage.userEmail, function(response){
		var data = response.data[0];
		
		// Extract mentor information
		$scope.mentor.firstname = data.FirstName;
		$scope.mentor.lastname = data.LastName;
		$scope.mentor.phone = data.Phone;
		$scope.mentor.address = data.npe01__Home_Address__c;
		
		// Extract emergency contacts
		$scope.contacts[0] = {
			name: $scope.mentor.Emergency_Contact_Name_1__c,
			phone: $scope.mentor.Emergency_Contact_Phone_1__c
		}
				
		$scope.contacts[1] = {
			name: $scope.mentor.Emergency_Contact_Name_2__c,
			phone: $scope.mentor.Emergency_Contact_Phone_2__c
		}

		// Remove null emergency contacts
		removeNullContact();
		
	});
	
}