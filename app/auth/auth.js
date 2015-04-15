angular.module('app.auth', ['ngRoute', 'firebase', 'firebase.auth'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/auth', {
      controller: 'AuthCtrl',
      templateUrl: 'auth/auth.html'
    });
  }])

  .controller('AuthCtrl', ['$scope', '$firebaseAuth', 'FBURL', 'Auth',
    function ($scope, $firebaseAuth, FBURL, Auth) {

      $scope.signup = function (email, pass) {
        Auth.$createUser({
          email: email,
          password: pass
        }).then(function (data) {
          console.log('User ' + data.uid + ' created successfully');
          return auth.$authWithPassword({
            email: email,
            password: pass
          });
        }).then(function (data) {
          console.log('Logged in as:', data.uid);
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
        }).catch(function (error) {
          console.error('Authentication failed:', error);
        });
      };
  }]);
