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

      $scope.signup = function (email, pass) {
        Auth.$createUser({
          email: email,
          password: pass
        }).then(function (data) {
          console.log('User ' + data.uid + ' created successfully');

          // Create basic user information
          var ref = new Firebase(FBURL + '/users/');
          var user = $firebaseObject(ref);
          user.uid = data.uid;
          user.game = {
            level: 1,
            trials: 30,
            time: 3000
          };
          user.$save().then(function (ref) {
            ref.key() === obj.$id; // true
          }, function(error) {
            console.log("Error:", error);
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
