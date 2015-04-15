angular.module('app.splash', ['ngRoute'])

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

  .controller('SplashCtrl', ['currentAuth', '$scope', function (currentAuth, $scope) {

  }]);
