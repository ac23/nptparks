// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var ionicApp = angular.module('starter', ['ionic', 'starter.services', 'starter.controllers', 'ngCordova']);
var db = null;

ionicApp.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    window.plugins.sqlDB.copy("parks.db", function() {
    	db = $cordovaSQLite.openDB("parks.db");
    	console.error("DB copied successfully");
    }, 
    function(error) {
    	console.error("There was an error copying the database: " + JSON.stringify(error));
     	db = $cordovaSQLite.openDB("parks.db");
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.directory', {
      url: '/directory',
      views: {
        'tab-directory': {
          templateUrl: 'templates/tab-directory.html',
          controller: 'ViewDetailCtrl'
        }
      }
    })
    .state('tab.view-detail', {
      url: '/view?type&viewID',
      views: {
        'tab-directory': {
      		templateUrl: 'templates/view-detail.html',
      		controller: 'ViewDetailCtrl',
      		params: {type: null, viewID: null}
        }
        
      }
      
    })

  .state('tab.filter', {
    url: '/filter',
    views: {
      'tab-filter': {
        templateUrl: 'templates/tab-filter.html',
        controller: 'ViewDetailCtrl'
      }
    }
  })
  .state('tab.about', {
      url: '/about',
      views: {
        'tab-about': {
      		templateUrl: 'templates/tab-about.html',
      		controller: 'AboutCtrl'
        }
      }
      
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
