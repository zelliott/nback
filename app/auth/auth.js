angular.module('app.auth', ['ngRoute', 'firebase'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/auth', {
      controller: 'AuthCtrl',
      templateUrl: 'auth/auth.html'
    });
  }])

  .controller('AuthCtrl', ['$scope', '$firebaseAuth', 'FBURL',
    function($scope, $firebaseAuth, FBURL) {
      var ref = new Firebase(FBURL),
        auth = $firebaseAuth(ref);

      $scope.signup = function (email, pass) {
        auth.$createUser({
          email: email,
          password: pass
        }).then(function (data) {
          console.log("User " + data.uid + " created successfully");
          return auth.$authWithPassword({
            email: email,
            password: pass
          });
        }).then(function (data) {
          console.log("Logged in as:", data.uid);
        }).catch(function (error) {
          console.error("Authentication failed: ", error);
        });
      };

      $scope.login = function (email, pass) {
        auth.$authWithPassword({
          email: email,
          password: pass
        }).then(function (data) {
          console.log("Logged in as:", data.uid);
        }).catch(function (error) {
          console.error("Authentication failed:", error);
        });
      };
  }]);
