angular.module('dreamapp.RequestChanges').factory('RequestChangesService', ['$http', '$state', ReuqestChangesService]);

function RequestChangesService($http, $state) {
    return {
        
        /*
            Sample request changes data:
            {"field_to_change":"mentee's mother's phone number",
             "change_to":"6183930000"}
        */
        send_request_changes: function(user) {
            $http.post('/send_request_changes')
            .then(function successCallback(response) {
                console.log()
            }, function errorCallback(response) {
                console.log(response);
            });
        }
    }
