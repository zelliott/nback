angular.module('app.splash', ['ngRoute', 'firebase', 'firebase.auth'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/splash', {
      controller: 'SplashCtrl',
      templateUrl: 'splash/splash.html',
      resolve: {
        'currentAuth': ['Auth', function(Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  }])

  .controller('SplashCtrl', ['currentAuth', '$scope', '$firebaseAuth', '$location',
                             'Auth',
    function (currentAuth, $scope, $firebaseAuth, $location, Auth) {

      // Allow anonymous authentication
      $scope.loginAnon = function () {
        Auth.$authAnonymously().then(function(data) {
          $location.path("/");
          console.log("Logged in as:", data.uid);
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
      };
  }]);
