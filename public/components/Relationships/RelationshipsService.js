angular.module('dreamApp.MenteeInfo').factory('RelationshipsService', ['$http', 'state', RelationshipsService]);        

function RelationshipsService($http, $state) {
    return {
        // call to fill emergency contact box
        /*
            Sample emergency contacts:
            [{"first_name":"Rotana",
              "last_name":"Shaker",
              "phone":"2223334455"},
             {"first_name":"Paul",
              "last_name":"Shaker",
              "phone":"6198324545"}]
        */
        get_emergency_contacts : function (user, callback) {
            $http.get('/get_emergency_contact', user)
            .then(function successCallback(response) {
                console.log(response);
                callback(response);
            }, function errorCallback(response) {
                console.log(response);
            });
        },
        // call to fill family contact box
        /*
            Sample family contacts:
            [{"first_name": "Miranda",
              "last_name": "Lee",
              "relationship": "mother",
              "phone":"6189993123",
              "email":"miranda.lee@yahoo.com"},
            {"first_name": "Sam",
             "last_name": "Lee",
             "relationship": "father",
             "phone":"6189993123",
             "email":"paul.lee@gmail.com.hk"},
            {"first_name": "Natalie",
             "last_name": "Chan",
             "relationship": "aunt",
             "phone":"6189993123",
             "email":""}]
        */
        get_family_contacts : function (user, callback) {
            $http.get('/get_family_contact', user)
            .then(function successCallback(response) {
                console.log(response);
                callback(response);
            }, function errorCallback(response) {
                console.log(response);
            });
        }  
    }
};