angular.module('app.settings', ['ngRoute', 'ngAudio', 'firebase.sync'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/settings', {
      controller: 'SettingsCtrl',
      templateUrl: 'settings/settings.html',

      // Require authentication for this page
      resolve: {
        'currentAuth': ['Auth', function (Auth) {
          return Auth.$requireAuth();
        }]
      }
    });
  }])

  .controller('SettingsCtrl',
    ['currentAuth', '$scope', 'User',
    function (currentAuth, $scope, User) {

      // Upon load from firebase
      User.$loaded()
        .then(function () {
          $scope.game = {
            level: User.game.level,
            trials: User.game.trials,
            time: User.game.time
          };
        })
        .catch(function (error) {
          console.error('Error:', error);
        });

      $scope.save = function () {
        User.game = $scope.game;
        
        User.$save().then(function (ref) {
          console.log('Success: ', ref);
        }, function (error) {
          console.log('Error:', error);
        });
      };
  }]);
