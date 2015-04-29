angular.module('app.auth', ['ngRoute', 'firebase', 'firebase.auth'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/auth', {
      controller: 'AuthCtrl',
      templateUrl: 'auth/auth.html'
    });
  }])

  .controller('AuthCtrl', ['$scope', '$location', '$firebaseAuth',
                           '$firebaseObject', 'FBURL', 'Auth',
    function ($scope, $location, $firebaseAuth, $firebaseObject, FBURL, Auth) {

      // Signup for a new account
      $scope.signup = function (email, pass) {
        Auth.$createUser({
          email: email,
          password: pass
        }).then(function (data) {
          console.log('User ' + data.uid + ' created successfully');

          // Create basic user information
          var ref = new Firebase(FBURL + '/users/' + data.uid);
          var user = $firebaseObject(ref);
          user.game = {
            level: 1,
            trials: 30,
            time: 3000,
            flashTime: 1000
          };
          user.$save().then(function (ref) {
            console.log('Success: ', ref);
          }, function(error) {
            console.log("Error: ", error);
          });

          return Auth.$authWithPassword({
            email: email,
            password: pass
          });
        }).then(function (data) {
          console.log('Logged in as:', data.uid);
          $location.path("/");
        }).catch(function (error) {
          console.error('Authentication failed: ', error);
        });
      };

      // Authenticate with email/password
      $scope.login = function (email, pass) {
        Auth.$authWithPassword({
          email: email,
          password: pass
        }).then(function (data) {
          console.log('Logged in as:', data.uid);
          $location.path("/");
        }).catch(function (error) {
          console.error('Authentication failed:', error);
        });
      };
  }]);
