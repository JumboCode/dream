// public/shared/Authentication/AuthenticationService.js

angular.module('dreamApp.authentication').factory('AuthenticationService', ['$http', '$state', '$window', '$rootScope', AuthenticationService]);
angular.module('dreamApp.nav_top').factory('AuthenticationService', ['$http', '$state', '$window', '$rootScope', AuthenticationService]);
  
function AuthenticationService($http, $state, $window, $rootScope) {

  var config = {
    apiKey: "AIzaSyBrvGppzGEzNpOVBJ3Nys3TJEIzHTzf-AM",
    authDomain: "dream-ca566.firebaseapp.com",
    databaseURL: "https://dream-ca566.firebaseio.com",
    storageBucket: "dream-ca566.appspot.com",
    messagingSenderId: "502207704368"
  };
  firebase.initializeApp(config);
  
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
	  	// Check if user is authorized
	    console.log('Checking auth: ', firebase.auth().currentUser)
		if (!firebase.auth().currentUser){
			// Redirect to login (if statement to prevent infinite redirect)
			if (!toState.name.includes('authentication'))
				window.location.href = '/login';
		}
  })
  
  var genTempPass = function() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(var i = 0; i < 15; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}	
	
  return {
    // call to authenticate the user with firebase
    login : function(user, callback) {
		firebase.auth().signInWithEmailAndPassword(user.username, user.password).then(function(user){
			user.getToken().then(function(response){
				callback({success:true,token:response});
			})
		}).catch(function(error) {
		    callback({success:false, error:error.message});
		})
    },
    // call to log the user out of firebase
    logout: function() {
        firebase.auth().signOut();
		$window.location.href = '/login';
    },
    // call to create a new user in firebase
    register: function(user, callback) {
		  firebase.auth().createUserWithEmailAndPassword(user.username, genTempPass()).then(function(userData){
			  firebase.auth().sendPasswordResetEmail(user.username);
			  callback({success:true,user:userData});
		  }).catch(function(error) {
			  callback({success:false, error:error.message});
		  });
    },
    // call to get the user authenticated with firebase
    getUser: function(callback) {
      user = firebase.auth().currentUser;
	  callback(user);

    },

    // TODO: create a frontend page for user deletion
    // will need input boxes w/ ng-models: 'user.username' and 'user.password'
    // called w/ ng-click="deleteuser(user)"
    // call to delete the user from firebase
    deleteuser: function() {
      	firebase.auth().currentUser.delete().then(function(){
		    $window.location.href = '/login'
		})
    },

    // TODO: create a frontend page for password change
    // will need input boxes w/ ng-models: 'user.username', 'user.oldpassword', and 'user.newpassword'
    // called w/ ng-click="changePassword(user)"
    // call to change user's password
    changePassword: function(user, callback) {
      	firebase.auth().currentUser.updatePassword(user.newpassword).then(function(){
		    callback({success:true});
			$window.location.href = '/'
		}).catch(function(error){
			console.log(error)
			 callback({success:false, error:error.message});
		})
    },

    // TODO: create a frontend page for password reset
    // will need input boxes w/ ng-model: 'user.username'
    // called w/ ng-click="resetPassword(user)"
    // call to reset user's password
    resetPassword: function(user, callback) {
		  firebase.auth().sendPasswordResetEmail(user.username).then(function(){
			  callback({success:true})
			  $window.location.href = '/'
		  }).catch(function(error){
			  console.log(error)
			  callback({success:false, error:error.message});
		  });

    }
  }
};
