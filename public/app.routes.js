angular.module('dreamApp').config(function($stateProvider, $urlRouterProvider){

  // ui-router:
  //  - http://www.funnyant.com/angularjs-ui-router/
  
  // absolute vs relative view names:
  //  - http://plnkr.co/edit/60RjoT?p=preview
  //  - https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views#view-names---relative-vs-absolute-names

  $urlRouterProvider.otherwise('/');
  
  $stateProvider
    .state("authentication", {
      abstract: true,
      templateUrl: "shared/Authentication/authentication.html",
      onEnter: function() {
        console.log("enter authentication");
      }
    })
    .state("authentication.login", {
      url: "^/login",
      views: {
        "content@": {
          controller: "AuthenticationController",
          templateUrl: "shared/Authentication/login.html"
        }
      }
    })
    .state("authentication.logout", {
      url: "^/logout",
      views: {
        "content@": {
          controller: "AuthenticationController",
          templateUrl: "shared/Authentication/logout.html"
        }
      }
    })
    .state("authentication.register", {
      url: "^/register",
      views: {
        "content@": {
          controller: "AuthenticationController",
          templateUrl: "shared/Authentication/register.html"
        }
      }
    })
    .state("authentication.reset", {
      url: "^/resetpassword",
      views: {
        "content@": {
          controller: "AuthenticationController",
          templateUrl: "shared/Authentication/resetpassword.html"
        }
      }
    })
    .state("authentication.changee", {
      url: "^/changeemail",
      views: {
        "content@": {
          controller: "AuthenticationController",
          templateUrl: "shared/Authentication/changeemail.html"
        }
      }
    })
    .state("authentication.delete", {
      url: "^/deleteuser",
      views: {
        "content@": {
          controller: "AuthenticationController",
          templateUrl: "shared/Authentication/deleteuser.html"
        }
      }
    })
    
    .state("root", {
      url: "/",
      views: {
        "navLeft": {
          controller: "NavLeftController",
          templateUrl: "shared/NavLeft/nav_left.html"
        },
        "navTop": {
          controller: "NavTopController",
          templateUrl: "shared/NavTop/nav_top.html"
        },
        "content": {
          controller: "HomeController",
          templateUrl: "components/Home/slider.html"
        }
      }
    })
   .state("root.changep", {
      url: "^/changepassword",
      views: {
        "content@": {
          controller: "AuthenticationController",
          templateUrl: "shared/Authentication/changepassword.html"
        }
      }
    })
   .state("root.attendance", {
      url: "^/attendance",
      views: {
        'content@': {
          controller: "AttendanceController",
          templateUrl: "components/Attendance/attendance.html"
        }
      }
    })
    .state("root.profile", {
      url: "^/profile",
      views: {
        'content@': {
          controller: "ProfileController",
          templateUrl: "components/Profile/profile.html"
        }
      }
    })
    .state("root.mentee_info", {
      url: "^/mentee_info",
      views: {
        'content@': {
          controller: "MenteeInfoController",
          templateUrl: "components/MenteeInfo/mentee_info.html"
        }
      }
    })
//    .state("root.relationships", {
//      url: "relationships",
//      views: {
//        'content@': {
//          controller: "RelationshipsController",
//          templateUrl: "components/Relationships/relationships.html"
//        }
//      }
//    })
//    .state("root.journal", {
//      url: "journal",
//      views: {
//        'content@': {
//          controller: "JournalController",
//          templateUrl: "components/Journal/journals.html"
//        }
//      }
//    })
    .state("root.request_changes", {
      url: "^/request_changes",
      views: {
        'content@': {
          controller: "RequestChangesController",
          templateUrl: "components/RequestChanges/request_changes.html"
        }
      }
    });
});

// don't use '#'s in URLs
angular.module('dreamApp').config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);