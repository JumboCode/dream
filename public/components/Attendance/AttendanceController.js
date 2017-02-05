angular.module('dreamApp.attendance').controller('AttendanceController', AttendanceController);

AttendanceController.$inject = ['$scope','AttendanceService'];

function AttendanceController($scope,AttendanceService) {
	
	// Convert entry object to the salesforce friendly object with correct column names.
	var entryToSalesforceEntry = function(entry){
		var sfEntries = [];
		
		if (entry == null)
			return sfEntries;
		
		for (child in entry) {
			var sfEntry = {};
			sfEntry.Youth__c = entry[child].Id;
			sfEntry.Present__c = entry[child].present;
			sfEntry.Id = entry[child].attenId
			sfEntries.push(sfEntry);
		}
		
		return sfEntries;
	}
	
	// This function adds the attendance entry id to the attendance entries so that it can be edited. This function
	// runs after the entries are saved.
	// Parameters:
	//	data - Response data from the saved entry.
	//  atten_entry - Attendance entry that was saved
	var extractIds = function(atten_entry, data){
		for (key in data){
			if (key == 'Id' || key == 'newEntry') continue;
			
			// Add the attendance entry id
			atten_entry.entry[key].attenId = data[key];
		}
		
		// Add the friday id
		atten_entry.entry.Id = data.Id;
	}
	
	// This function saves the given attendance entry.
	var saveEntries = function(atten_entry){
		$scope.promiseAttendancePost = AttendanceService.post_attendance(localStorage.userEmail, {date:atten_entry.date,category:atten_entry.summary,entries:entryToSalesforceEntry(atten_entry.entry),fridayId:atten_entry.entry.Id},function(response){
			if (response.data.newEntry){
				extractIds(atten_entry, response.data);
			}
			console.log(atten_entry)
		});	
	}
	
	// This function extracts the names and ids for the mentees attendance list. It formats it in a list of objects
	// That allow them to be displayed in the ui.
	var extractNames = function(contacts){
		list = [];
		
		if (contacts.length == 0)
			return list;
		
		for (var i=0; i < contacts.length; i++){
			list.push({Name:contacts[i].Name, Id:contacts[i].Id});
		}
		return list;
	}
	
	// This function extracts the attendance entries in a format that is friendly to the edit functions and user interface.
	var extractEntries = function(data){		
		atten_entries = [];
		
		if (data == null)
			return null;
		
		// Extract the attendance entries
		for (i=0; i<data.length; i++){
			
			entries = data[i].Attendance__r.records;
			fridayId = data[i].Id;
			category = data[i].Event_category__c;
			date = new Date(data[i].Friday_Date__c);
			
			var attendance = {};
			
			// Extract the mentee ids, anmes, and attendance status.
			for (j = 0; j < entries.length; j++){	
				// Set Fields
				attendance.Id = fridayId;

				attendance[entries[j].Youth__r.Id] = {Name:entries[j].Youth__r.Name, Id:entries[j].Youth__r.Id, present:entries[j].Present__c, attenId: entries[j].Id};
			}
			
			// Package entry into attendance object.
			var atten_entry = {'entry':attendance, 'summary':category, 'date':date};
			console.log(date)
			atten_entries.push(atten_entry);
		}
		
		return atten_entries;
	}
	
	// Query for list of mentees
	$scope.promiseMenteeList = AttendanceService.mentee_attendance_list(localStorage.userEmail,function(response){
		$scope.menteesList = extractNames(response.data[0].Contacts.records);
	});
	
	// Query for attendance entries already in salesforce
	$scope.promiseAttendanceList = AttendanceService.attendance_list(localStorage.userEmail,function(response){
		$scope.attendance_entries = extractEntries(response.data);
		console.log(response)
	});
	
	// Necesarry for initially loading the page.
	if (localStorage.getItem('attendance_entries') == null) {
		$scope.attendance_entries = [];
	} else {
		$scope.attendance_entries = JSON.parse(localStorage['attendance_entries']);
	}
	edit_index = -1;
  
  // This function saves the attendance entry and then posts this to salesforce.
  $scope.save = function() {
    var entry = {};
    for (i = 0 ; i<$scope.menteesList.length ; i++){
      var mentee = document.getElementById($scope.menteesList[i].Id);
      if (mentee.checked){
		$scope.menteesList[i].present = true;
		// IMPORTANT - Must stringify then parse (deep copy) for edit to work
        entry[mentee.value] = JSON.parse(angular.toJson($scope.menteesList[i]));
      }
      else {
		$scope.menteesList[i].present = false;
        entry[mentee.value] = JSON.parse(angular.toJson($scope.menteesList[i]));            
	  }
	  if (edit_index != -1){
		  entry[mentee.value].attenId = $scope.attendance_entries[edit_index].entry[mentee.value].attenId;
	  }
    }

	var atten_entry = {'entry':entry,'summary':$scope.newEvent,'date':$scope.newDate};
	  
    if (edit_index != -1) {
	  var fridayId = $scope.attendance_entries[edit_index].entry.Id;
	  atten_entry.entry.Id = fridayId;
      $scope.attendance_entries[edit_index] = atten_entry;
    } else {
      $scope.attendance_entries.unshift(atten_entry);
    }
    $scope.attendance_entries.sort();

	localStorage.setItem('attendance_entries', angular.toJson($scope.attendance_entries));
    edit_index = -1;
	  
	saveEntries(atten_entry);
  };
    
	// This function is currently unused... Deletes the item from the attednace entries list.
    $scope.remove = function(item) {
      for (var i = item.$index; i < $scope.attendance_entries.length-1; i++) {
        $scope.attendance_entries[i] = $scope.attendance_entries[i + 1];
      }
      $scope.attendance_entries.pop();
      localStorage.setItem('attendance_entries', angular.toJson($scope.attendance_entries));
    };
	
	// Edit the given attendance entry. Loads relevant data to the user interface.
    $scope.edit = function(item) {
      // Set check boxes in user interface
      for (id in $scope.attendance_entries[item.$index].entry){
		var mentee = document.getElementById(id);
		if (mentee == null) continue;

		mentee.checked = $scope.attendance_entries[item.$index].entry[id].present;
      }
		
      $scope.newDate = $scope.attendance_entries[item.$index]['date'];
	  console.log($scope.attendance_entries[item.$index]['date'], $scope.newDate)

      $scope.newEvent = $scope.attendance_entries[item.$index]['summary'];
      edit_index = item.$index;
	  $('html, body').animate({ scrollTop: 0 }, 'fast');
    };

    function compare(a,b) {
		console.log(a,b)
      a_date = a['date'].split('/');
      b_date = b['date'].split('/')
      if (a_date[2] < b_date[2]) {
        return -1;
      } else if (a_date[2] > b_date[2]) {
        return 1;
      } else if (a_date[0] < b_date[0]) {
        return -1;
      } else if (a_date[0] > b_date[0]) {
        return 1;
      } else if (a_date[1] < b_date[1]) {
        return -1;
      } else if (a_date[1] > b_date[1]) {
        return 1;
      } else {
        return 0;
      }
    }

  }