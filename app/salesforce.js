var bluebird = require('bluebird');

module.exports = function(jsforce) {
	
	this.oauth2 = new jsforce.OAuth2({
		clientId :  process.env.CLIENT_ID,
		clientSecret:process.env.CLIENT_SECRET,
  		redirectUri : 'http://localhost:8080/oauth2/callback'
	}); 
	
	this.getConnection = function(){
		var conn;
		if (!process.env.sfToken) {
          conn = new jsforce.Connection({oauth2: oauth2});
        } else {
			console.log(process.env.sfToken)
          conn = new jsforce.Connection({
            oauth2 : oauth2,
            instanceUrl : process.env.sfInstance,
            accessToken : process.env.sfToken
          });
        }
		console.log(conn)

		return conn;
	};
};