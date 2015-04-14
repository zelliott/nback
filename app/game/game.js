angular.module('app.game', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/game', {
      controller: 'GameCtrl',
      templateUrl: 'game/game.html'
    });
  }])

  .controller('GameCtrl', ['$scope', function($scope) {

  }]);
