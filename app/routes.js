// app/routes.js

// middleware
// - http://expressjs.com/en/guide/using-middleware.html

// difference between router- and app-level middleware
// - http://stackoverflow.com/questions/27227650/difference-between-app-use-and-router-use-in-express
// - http://stackoverflow.com/questions/29457008/whats-the-difference-between-application-and-router-level-middleware-when-rou

var jsforce        = require('jsforce');

module.exports = function(app,express) {
	

  // NOTE, the following are equivalent:
  // - res.sendStatus(500);
  // - res.status(500).send('Internal Server Error');
  
  // feel free to add to these as needed
  HttpStatusCodes = {
    success:      { code: 200, description: "Success" },
    unauthorized: { code: 401, description: "Unauthorized" },
    notFound:     { code: 404, description: "Not Found" },
    serverError:  { code: 500, description: "Internal Sever Error" }
  }


  // vvvvvvvvvvvvvvvvvvv  SERVER ROUTES  vvvvvvvvvvvvvvvvvvv //
  // - order MATTERS when declaring middleware (everything here is middleware)

  // not sure what to do about this one yet...
  // app.get('/', function(req, res) {
  //   // TODO
  //   // res.sendFile('/public/component/Welcome/welcome.html', { root: __dirname + '/..' });
  // });
  
  app.use('*', function(req, res, next) {
    console.log("---------------------------------");
    if (req) {
      console.log(req.originalUrl, req.originalMethod);
    } else {
      console.log(req);
    }
    console.log("---------------------------------");
    next();
  })

  // display the page to the user
  app.get('/register', function(req, res) {
    res.sendFile('/public/shared/Authentication/authentication.html', { root: __dirname + '/..' });
  });
  // register the user with firebase
  app.post('/register', function(req, res) {
    register(req.body.username,/* req.body.password, req.body.password2, */function(status, info) {
      res.status(status);
      res.send(info);
    });
  });

  // display the page to the user
  app.get('/deleteuser', function(req, res) {
    res.sendFile('/public/shared/Authentication/authentication.html', { root: __dirname + '/..' });
  });
  // delete the user from firebase
  app.post('/deleteuser', function(req, res) {
    deleteuser(req.body.username, req.body.password, function(status, info) {
      res.status(status);
      res.send(info);
    });
  });

  // display the page to the user
  app.get('/changePassword', function(req, res) {
    res.sendFile('/public/shared/Authentication/authentication.html', { root: __dirname + '/..' });
  });
  // delete the user from firebase
  app.post('/changePassword', function(req, res) {
    changePassword(req.body.username, req.body.oldpassword, req.body.newpassword, function(status, info) {
      res.status(status);
      res.send(info);
    });
  });

  // display the page to the user
  app.get('/changeEmail', function(req, res) {
    res.sendFile('/public/shared/Authentication/authentication.html', { root: __dirname + '/..' });
  });
  // delete the user from firebase
  app.post('/changeEmail', function(req, res) {
    changeEmail(req.body.oldusername, req.body.newusername, req.body.password, function(status, info) {
      res.status(status);
      res.send(info);
    });
  });

  // display the page to the user
  app.get('/resetPassword', function(req, res) {
    res.sendFile('/public/shared/Authentication/authentication.html', { root: __dirname + '/..' });
  });
  // delete the user from firebase
  app.post('/resetPassword', function(req, res) {
    resetPassword(req.body.username, function(status, info) {
      res.status(status);
      res.send(info);
    });
  });
	
/********************************************************************/
/**************************** SALESFORCE ****************************/
/********************************************************************/
	
// This functions logs in the user to salesforce using the OAuth2 Resource Owner Password Credential flow.
// This authentication should only be done AFTER the user is verified in firebase.
// Authentication values are stored in env vars for security reasons.	
var auth = function(){
	console.log('Authenticating Salesforce')
    var conn = new jsforce.Connection({ oauth2 : oauth2 });
	conn.login(process.env.SF_USER, process.env.SF_PASSWORD, function(err, userInfo) {
  		if (err) { return console.error(err); }
		// Save token and instance for future connections
  		process.env.sfToken = conn.accessToken;
		process.env.sfInstance = conn.instanceUrl;
		
	});
}

// call auth
auth();

// This function determines if a given user is a chair. It queries the 'Chair' campaign in salesforce
// to see if there is a match with the user
app.get('/isChair', function(req,res){
		var user = req.query.user;
		getUser(user,function(email){
			if(email){
				var conn = getConnection();
				conn.sobject("Campaign")
				.select('Name')
				.include("CampaignMembers") // Query Contacts for given account (only active mentors)
					// after include() call, entering into the context of child query.
					.select("Email")
					.where("Email = '" + email + "'")
					.end() // be sure to call end() to exit child query context
				.where("Name = 'Chair'")
				.execute(function(err, records) {
					if (err) { return console.error(err); }

					if (records[0].CampaignMembers != null){
						process.env.chair = true;
						res.send(true);
					}
					else{
						process.env.chair = false;
						res.send(false);	
					}
				  });
			}
		});
});
  
/**************************************************************************/
/**************************** Front End Routes ****************************/
/**************************************************************************/
	
// This function gets the mentor profile information from salesforce. Email is used to find the correct entry.
 app.get('/get_mentor_info', function(req, res) {
	var user = req.query.user;
    getUser(user,function(email){
		if (email){
			// Get connection
			var conn = getConnection();

			// Run sobject query
			conn.sobject("Contact")
			  .select('*')
			  .where("Contact.Email LIKE '" + email + "'")
			  .limit(1)
			  .execute(function(err, records) {
				if (err) { return console.error(err); }
				res.json(records)
			  });
		}
	});
  });
	
// This function gets a list of active mentees for an attendance entry 
 app.get('/mentee_attendance_list', function(req, res) {
	var user = req.query.user;
    getUser(user,function(email){
		if (email){
			var conn = getConnection();

			// Must query contact for community id, this is the program that they are a chair for.
			conn.sobject("Contact")
			  .select('Community__r.Id')
			  .where("Contact.Email LIKE '" + email + "'")
			  .limit(1)
			  .execute(function(err, records) {
				if (err) { return console.error(err); }

				// Query 'Active' 'Participants' in the given account.
				conn.sobject("Account")
				.select('Name')
				.include("Contacts") // Query Contacts for given account (only active mentees)
					.select("Name,Id")
					.where("Involvement_Status__c = 'Active' AND RecordTypeName__c = 'Participant'")
					.end() // be sure to call end() to exit child query context
				.where("Account.Id = '" + records[0].Community__r.Id + "'")
				.limit(1)
				.execute(function(err, contacts) {
					if (err) { return console.error(err); }
					res.json(contacts)
				  });
			  });
		}
	})
  });

  // This function gets all attendance entries for the chairs community.
  app.get('/attendance_list', function(req, res) {
	var user = req.query.user;
    getUser(user,function(email){
		if (email){
		var conn = getConnection();

		// Determine community
		conn.sobject("Contact")
		  .select('Community__r.Id')
		  .where("Contact.Email LIKE '" + email + "'")
		  .limit(1)
		  .execute(function(err, records) {
			if (err) { return console.error(err); }

			// Query for all events and under that the set of attendance entires.
			conn.sobject("Fridays__c")
			.select('Id,Friday_Date__c,Event_category__c')
			.include("Attendance__r") 
				.select("Youth__r.Name,Youth__r.Id, Present__c, Id")
				.end()
			.where("Program_Name__r.Id = '" + records[0].Community__r.Id + "'")
			.execute(function(err, contacts) {
				if (err) { return console.error(err); }
				res.json(contacts)
			  });
		  });
		}
	});
  });
	
  // This function is a helper function for posting attendance entries. It adds the 'Friday__c' value
  // to all attendance entries sent from the front end.
  // Parameters:
  // 	entries - the list of students and if they attended the meeting.
  // 	fridayId - the id of the event that these entries belong to.
  var addFridayId = function(entries,fridayId){
	  for (entry in entries){
		  entries[entry].Friday__c = fridayId;
	  }
  }
  
  // This function is a helper function for posting attendance entries. It formats the response object
  // for the front end so that it can add the correct ids to the entry.
  // Parameters:
  //	ret - the return from the added attendance entries
  var postResponseObject = function(ret,entries,fridayId){
	  var response = {}
	  
	  // Add Youth__c id to object
	  for (var i=0; i<entries.length; i++){
		  response[entries[i].Youth__c] = ret[i].id;
	  }
	  
	  // Add friday event id to response
	  response.Id = fridayId;
	  
	  // Used in the front end to know if this was updating an entry or creating a new one.
	  response.newEntry = true;
	  return response;
  }
  
  // This function either adds or updates an attendance entry based on whether fridayId has been defined yet.
  app.post('/post_attendance', function(req, res) {
	// req.body = {params:{parameters...}, data:{data...}}
	var user = req.query.user;
    getUser(user,function(email){
		if (email){  
			var conn = getConnection();

			// Determine community for chair  
			conn.sobject("Contact")
			  .select('Community__r.Id')
			  .where("Contact.Email LIKE '" + req.body.params.user + "'")
			  .limit(1)
			  .execute(function(err, records) {
				if (err) { return console.error(err); }

				// Create friday in db if it doesnt exist. fridayId will be defined if the entry is being edited.
				if (req.body.data.fridayId == null){
					// Create new attendance event
					conn.sobject("Fridays__c").create({ Program_Name__c : records[0].Community__r.Id, Friday_Date__c:req.body.data.date, Event_category__c:req.body.data.category }, function(err, ret) {
						if (err || !ret.success) { return console.error(err, ret); }

						// Extract new friday id from return
						var fridayId = ret.id
						addFridayId(req.body.data.entries,fridayId);

						// Add actual entries to event
						conn.sobject("Attendance__c").createBulk(req.body.data.entries, function(err,ret){
							if (err) { return console.error(err, ret); }
							res.send(postResponseObject(ret,req.body.data.entries,fridayId));
						})
					});
				}
				else {
					conn.sobject("Fridays__c").update({Id:req.body.data.fridayId, Program_Name__c : records[0].Community__r.Id, Friday_Date__c:req.body.data.date, Event_category__c:req.body.data.category }, function(err, ret) {
						if (err || !ret.success) { return console.error(err, ret); }

						// Must delete Youth__c value because it cannot be updated in salesforce (throws error)
						for (entry in req.body.data.entries){
							delete req.body.data.entries[entry].Youth__c;
							req.body.data.entries[entry].Friday__c = req.body.data.fridayId;
						}

						// Extend timeout or throws error 
						conn.bulk.pollTimeout = 60000; // 60 sec

						// Update all entries
						conn.sobject("Attendance__c").updateBulk(req.body.data.entries, function(err,ret){
							if (err) { return console.error(err, ret); }
							res.send('success');
						})

					});
				}
			  });
		}
	});
	
  });
  
  // This function gets the information for a given mentors mentee. Mentor email must be stored in getUser().password.email.
  // If the mentor is a chair, it will query the information for all active mentees in their community. 
  app.get('/get_mentee_info', function(req, res) {
	var user = req.query.user;
    getUser(user,function(email){
		if (email){
			var conn = getConnection();

			if (process.env.chair == 'true'){	
				// Must query contact for community id, this is the program that they are a chair for.
				conn.sobject("Contact")
				  .select('Community__r.Id')
				  .where("Contact.Email LIKE '" + email + "'")
				  .limit(1)
				  .execute(function(err, records) {
					if (err) { return console.error(err); }

					// Query 'Active' 'Participants' in the given account.
					conn.sobject("Account")
					.select('Name')
					.include("Contacts") // Query Contacts for given account (only active mentees)
						.select("*")
						.where("Involvement_Status__c = 'Active' AND RecordTypeName__c = 'Participant'")
						.end() // be sure to call end() to exit child query context
					.where("Account.Id = '" + records[0].Community__r.Id + "'")
					.limit(1)
					.execute(function(err, records) {
						if (err) { return console.error(err); }
						res.json(records[0].Contacts.records)
					  });
				  });
			} else{
				// Get all contact information for a users mentee.
				conn.sobject("npe4__Relationship__c")
				  .select('npe4__Contact__r.*')
				  .where("npe4__RelatedContact__r.npe01__HomeEmail__c LIKE '" + email + "' AND npe4__Type__c LIKE 'Mentor/Mentee' AND npe4__Status__c = 'Current'")
				  .limit(1)
				  .execute(function(err, records) {
					if (err) { return console.error(err); }
					res.json(records[0].npe4__Contact__r)
				  });
			}
		}
	});
  });

	
    /**************************************************************************/
	/**************************** Route To Angular ****************************/
	/**************************************************************************/
	
	// Must GO LAST or else it intercepts get and post requests
  	app.get('*', function(req, res) {
		res.sendFile('/public/root.html', { root: __dirname + '/..' });
	});
};