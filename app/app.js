angular.module('app', [
  'app.config',
  'app.splash',
  'app.auth',
  'app.game',
  'app.settings',
  'app.stats'
  ])

  .run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location) {

    // Bring whether or not the user is logged in into the $rootScope
    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
      $rootScope.auth = Auth;
    });

    /* If you try to go to a page that requires authentication, and you are
     * not loggedin, redirect user to splash
     */
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      if (error === "AUTH_REQUIRED") {
        $location.path("/splash");
      }
    });
  }]);
