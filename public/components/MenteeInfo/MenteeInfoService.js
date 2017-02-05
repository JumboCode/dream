angular.module('dreamApp.mentee_info').factory('MenteeInfoService', ['$http', '$state', MenteeInfoService]);

function MenteeInfoService($http, $state) {
    return {
        get_mentee_info: function(user, callback) {
            var promise = $http.get('/get_mentee_info', {params:{user:window.sessionStorage.authToken}})
            promise.then(function successCallback(response) {
                console.log(response);
                callback(response);
            }, function errorCallback(repsonse) {
                console.log(response);
            });
			return promise;
        }
    }
};