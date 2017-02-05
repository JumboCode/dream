# The Dream App by Tufts' JumboCode 

### Task List

#### Client-Side (Front end)

- [x] Port front end to new angular/express app
- [ ] Update UI (in progress...?)
- [ ] Beautify the login/register/logout pages
- [x] Move justified-gallary to libs folder
- [x] Fill out front end part of folder hierarchy
- [ ] ...

#### Server-Side (Back end)

- [x] Set up user authentication with firebase
- [x] Make user data available on front end
- [ ] Make data from salesforce queries available to front end
- [ ] Fill out back end part of folder hierarchy
- [x] Set up user creation with firebase
- [x] Set up user deletion with firebase
- [x] Set up user password change with firebase
- [x] Set up user username change with firebase
- [x] Set up user password reset with firebase
- [ ] Make user roles (mentor, admin, mentee, etc.)
- [x] Make login page input 'matter'
- [ ] ...

#### Salesforce

- [x] Authenticate with salesforce
- [x] Make some successful test queries
- [ ] Make queries to return useful, relevent data
- [ ] ...

### The app's folder structure

```
- app               <!-- all backend and Node or Express stuff -->
----- routes.js
----- firebase.js
----- salesforce.js
- config
----- db.js 
- node_modules      <!-- created by npm install -->
- public/           <!-- all frontend and angular stuff -->
----- assets/
---------- img/      <!-- Images and icons for the app -->
---------- css/      <!-- All styles and style related files (SCSS or LESS files) -->
---------- js/       <!-- JavaScript files written for your app that are not for angular (e.g. utility functions) -->
---------- libs/     <!-- Third-party libraries not belonging to npm -->
----- components/         <!-- each component is treated as a mini Angular app -->
---------- Attendance/    <!-- this component is a page for... -->
--------------- attendance.html
--------------- attendanceController.js
--------------- attendanceModule.js
---------- Home/          <!-- this component is a page for the app's home page -->
--------------- HomeController.js   <!-- the controller for the home page, initializes justified gallery -->
--------------- HomeModule.js
--------------- slider.html         <!-- displays each image in assets/img/ using the justified gallery -->
---------- Journal/       <!-- this component is a page for the mentor to write and view journal entries -->
--------------- JournalController.js  <!-- Handles the storage and display of the jounral objects -->
--------------- JournalModule.js
--------------- journals.html         <!-- The html for the jounals view -->
---------- MenteeInfo/    <!-- This compoment is a page for the mentor to view relevant information about their mentee -->
--------------- MenteeInfoController.js <!-- populate the mentee info panels with data -->
--------------- MenteeInfoModule.js
--------------- mentee_info.html        <!-- HTML for the mentee info view -->
---------- Relationships/   <!-- This component is a page for quickly viewing mentee contacts -->
--------------- RelationshipsController.js  <!-- populate the relationships panels with data -->
--------------- RelationshipsModule.js      
--------------- relationships.html          <!-- HTML for the relationships page -->
---------- RequestChanges/  <!-- This component is a form to request information changes -->
--------------- RequestChangesController.js   <!-- Does nothing so far -->
--------------- RequestChangesModule.js       
--------------- request_changes.html          <!-- HTML for the request changes form -->
---------- ...
----- shared/             <!-- acts as reusable components or partials of our site -->
---------- Authentication/    <!-- this a set of pages for authenticating users (login/logout/register) -->
--------------- ...
---------- ...
----- app.module.js     <!-- angular modules -->
----- app.routes.js     <!-- angular routes -->
----- root.html         <!-- the main page of the app -->
- package.json    <!-- tells npm which packages we need -->
- server.js       <!-- set up our node application -->
- README.md
```
