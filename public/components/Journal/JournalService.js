
angular.module('dreamApp.journal').factory('JournalService', ['$http', '$state', '$window', JournalService]);
 
function JournalService($http, $state, $window) {
  return {

    // display all previous journal entries
    get_journal_entries: function(callback) {
      $http.get('/journalentries')
           .then(function successCallback(response) {
              callback(response.data);
              
              /*  
                Sample of what we assume 'response.data' is:
                  [{"entry": "jIndex", "date": "jDate", "summary": "jSumm"}, 
                   {"entry": "jIndex", "date": "jDate", "summary": "jSumm"},
                   {"entry": "jIndex", "date": "jDate", "summary": "jSumm"}]
              */

            }, function errorCallback(response) {

            });
    }

    // append new entry to already existing entries

    /*
      Sample 'entry':
        {"entry": "jIndex", "date": "jDate", "summary": "jSumm"}
    */

    new_entry: function(entry) {
      $http.post('/users' + user.id + '/journal_entry')
           .then(function successCallback(response) {
              callback(response.data);
            }, function errorCallback(response) {
              
            });
    }
  }
};
