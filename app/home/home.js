angular.module('app.home', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      controller: 'HomeCtrl',
      templateUrl: 'home/home.html'
    });
  }])

  .controller('HomeCtrl', ['$scope', function($scope) {

  }]);
