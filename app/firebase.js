// app/auth.js

module.exports = function(firebase) {
  // This is called a wrapper function, it allows for good seperation
  // of responsibility and information hiding (in this case, this
  // function helps to relegate all firebase code to this file)
  this.getUser = function(token,callback) {
	firebase.auth().verifyIdToken(token).then(function(decodedToken) {
	  callback(decodedToken.email);
	}).catch(function(error) {
	  console.log("Auth Error");
	  callback(null)
	});
  }
};
