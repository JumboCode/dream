angular.module('dreamApp.profile').factory('ProfileService', ['$http', '$state', ProfileService]);

function ProfileService($http, $state) {
    return {
        
        /* 
            Sample mentor info
            {"first_name": "Judy",
             "last_name": "Sagan",
             "birth_date": "03/14/1993",
             "university": "Tufts University",
             "phone":"6189993123",
             "email":"judy.sagan@tufts.edu"}
        */
        get_mentor_info: function (user, callback) {
            var promise = $http.get('/get_mentor_info', { params:{ user:window.sessionStorage.authToken} });
			promise.then(function successCallback(response) {
                callback(response);
            }, function errorCallback(response) {
            });
			return promise;
        },
        
        /* 
            Sample mentor contacts
            [{"first_name":"Rotana",
              "last_name":"Shaker",
              "phone":"2223334455"},
             {"first_name":"Paul",
              "last_name":"Shaker",
              "phone":"6198324545"}]
        */
    }
};