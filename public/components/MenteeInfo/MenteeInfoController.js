angular.module('dreamApp.mentee_info').controller('MenteeInfoController', MenteeInfoController);

MenteeInfoController.$inject = ['$scope','MenteeInfoService'];

function MenteeInfoController($scope,MenteeInfoService) {
  $scope.menteeData = [];
	
  $scope.emergency_contacts = []

  // This function extracts the mentee information from the salesforce response data.
  // Parameters:
  //	data - response object from query 'get_mentee_info'
  var extractMenteeInfo = function(data){
	  if (data == null)
		  return;
	  
	  $scope.mentee = {
		  name: data.Name,
		  age: data.Age__c,
		  gender: data.Gender__c
	  }
	  
	  $scope.personal = {
	    houseLang: data.Household_Language__c,
    	address: data.npe01__Home_Address__c,
        email: data.npe01__HomeEmail__c ? data.npe01__HomeEmail__c : 'None',
        birthDate: data.Birthdate
	  }
  }
	
  // This function extracts the mentee health information from the salesforce response data.
  // Parameters:
  //	data - response object from query 'get_mentee_info'
  var extractMenteeHealth = function(data){
	  if (data == null)
		  return;
	  
	  $scope.health = {
		physician: data.Physician_Name__c,
		physPhone: data.Physician_Phone_Number__c,
		meds: data.Prescription_Medication_Taken_Regularly__c,
		swallowPills: data.Able_to_Swallow_Pill__c ? 'Yes' : 'No',
		medConditions: data.Current_Medical_Conditions__c,
		allergies: data.Current_Allergies__c
	  }
  }
  
  // This function extracts the mentee emergency contact information from the salesforce response data.
  // Parameters:
  //	data - response object from query 'get_mentee_info'
  var extractMenteeEmergency = function(data){
	  if (data == null)
		  return;
	  
 	  $scope.emergency_contacts = [
		  {
			name: data.Emergency_Contact_Name_1__c,
			phone: data.Emergency_Contact_Phone_1__c,
			relationship: data.Emergency_Contact_Relationship_1__c,
		  },
		  {
			name: data.Emergency_Contact_Name_2__c,
			phone: data.Emergency_Contact_Phone_2__c,
			relationship: data.Emergency_Contact_Relationship_2__c,
		  },
		  {
			name: data.Emergency_Contact_Name_3__c,
			phone: data.Emergency_Contact_Phone_3__c,
			relationship: data.Emergency_Contact_Relationship_3__c,
		  }
	  ];
  }
  
  $scope.loadMenteeInfo = function(data){
	  if (data == null) return;
	  
	  extractMenteeInfo(data);
	  extractMenteeHealth(data);
	  extractMenteeEmergency(data);
  }
  
  // Query for mentee information from salesforce. If it is an array it will populate the menteeData array with
  // the mentee info. Otherwise, it will simply populate the fields with the mentee data given.
  $scope.promise = MenteeInfoService.get_mentee_info(localStorage.userEmail,function(response){
	  var data = response.data
	  
	  if (Array.isArray(data)){		// Store data for mentees
		$scope.menteeData = data;  
		console.log($scope.menteeData)
	  } else {						// display data if only 1 mentee
		$scope.loadMenteeInfo(data);
	  }

  })

  // Function for updating the panel collapse indicator.
  $scope.update_expanded = function(id, target) {
    $('#' + target).collapse("toggle");
    var element = document.getElementById(id);
    var target = document.getElementById(target);
    var expanded = target.getAttribute("aria-expanded");

	element.children[0].children[0].className = expanded == "true" ? "fa fa-chevron-up":"fa fa-chevron-down";
  };

}