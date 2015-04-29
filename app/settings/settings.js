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
    ['currentAuth', '$scope', 'User', '$timeout',
    function (currentAuth, $scope, User, $timeout) {

      $scope.displaySuccess = false;

      // Upon load from firebase, load current settings
      User.$loaded()
        .then(function () {
          $scope.game = {
            level: User.game.level,
            trials: User.game.trials,
            time: User.game.time,
            flashTime: User.game.flashTime
          };
        })
        .catch(function (error) {
          console.error('Error:', error);
        });

      // Save changed user settings
      $scope.save = function () {
        User.game = $scope.game;
        User.$save().then(function (ref) {
          console.log('Success: ', ref);
          $scope.success();
        }, function (error) {
          console.log('Error:', error);
        });
      };

      // Display a success msg in the view
      $scope.success = function () {
        $scope.displaySuccess = true;
        $timeout(function () {
          $scope.displaySuccess = false;
        }, 2000);
      }
  }]);
