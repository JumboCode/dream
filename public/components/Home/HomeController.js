angular.module('dreamApp.home').controller('HomeController', HomeController);

HomeController.$inject = ['$scope','$http'];

function HomeController($scope,$http) {
    //console.log("in HomeController");
	
	// Test query to check connection
//	$http.get('/testData').then(function(response){
//		console.log(response);
//	})
	
    $(document).ready(function(){
        $('#mygallery').justifiedGallery({
            rowHeight : 160,
            lastRow : 'hide',
            margins : 15
        });
    });
}