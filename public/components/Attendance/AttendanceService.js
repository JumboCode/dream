angular.module('dreamApp.attendance').factory('AttendanceService', ['$http', '$state', AttendanceService]);

function AttendanceService($http, $state) {
    return {
        

        /* 
            Sample activity list:
            {"Outing", "Weekly Meeting", "Field Trip"}
        */
        activity_list: function(user, callback) {
            $http.get('/activity_list')
            .then(function successCallback(response) {
                console.log(response)
				//callback(response);
            }, function errorCallback(response) {
            });
        },
        
        /* 
            Sample mentee attendance list:
            {"Fred","Ben, "Flora", "Judy", "Lynn"}
        */
        mentee_attendance_list: function(user, callback) {
            var promise = $http.get('/mentee_attendance_list', { params:{ user:window.sessionStorage.authToken} })
            promise.then(function successCallback(response) {
                callback(response);
            }, function errorCallback(response) {
            });
			return promise;
        },
        
        /* 
            Sample list of attendances:
            [{"event_name": "Art Museum",
             "date": "04/01/2016",
             "attendance": {"Fred":true,
                            "Ben":true,
                            "Flora":false, 
                            "Judy":true,
                            "Lynn":false}},
             {"event_name": "Laser Tag",
              "date": "04/07/2016",
              "attendance": {"Fred":false,
                             "Ben":true,
                             "Flora":true, 
                             "Judy":true,
                             "Lynn":true}},
             {"event_name": "Writing Workshop",
              "date": "04/12/2016",
              "attendance": {"Fred":true,
                             "Ben":true,
                             "Flora":false, 
                             "Judy":true,
                             "Lynn":false}}]
        */
        attendance_list: function(user, callback) {
            var promise = $http.get('/attendance_list', { params:{ user:window.sessionStorage.authToken} })
            promise.then(function successCallback(response) {
                callback(response);
            }, function errorCallback(response) {
            });
			return promise;
        },
        
        /* 
            Sample new attendance entry:
            {"event_name": "Art Museum",
             "date": "04/12/2016",
             "attendance": {"Fred":true,
                            "Ben":true,
                            "Flora":false, 
                            "Judy":true,
                            "Lynn":false}}
        */
        post_attendance: function(user, data, callback) {
			console.log(data);
            var promise = $http.post('/post_attendance', { params:{ user:window.sessionStorage.authToken},data:data})
            promise.then(function successCallback(response) {
                callback(response);
            }, function errorCallback(response) {
            });
			return promise;
        }
    }
};
