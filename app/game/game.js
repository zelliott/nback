angular.module('app.game', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
      controller: 'GameCtrl',
      templateUrl: 'game/game.html',

      // Require authentication for this page
      resolve: {
        'currentAuth': ['Auth', function(Auth) {
          return Auth.$requireAuth();
        }]
      }
    });
  }])

  .controller('GameCtrl', ['currentAuth', '$scope', function (currentAuth, $scope) {
    console.log(currentAuth);
  }]);
