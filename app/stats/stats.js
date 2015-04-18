angular.module('app.stats', ['ngRoute', 'ngAudio', 'firebase.sync'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/stats', {
      controller: 'StatsCtrl',
      templateUrl: 'stats/stats.html',

      // Require authentication for this page
      resolve: {
        'currentAuth': ['Auth', function (Auth) {
          return Auth.$requireAuth();
        }]
      }
    });
  }])

  .controller('StatsCtrl',
    ['currentAuth', '$scope', 'User',
    function (currentAuth, $scope, User) {

      // Upon load from firebase, initialize the game
      User.$loaded()
        .then(function () {
          $scope.reports = User.reports;
          $scope.transform($scope.reports);
        })
        .catch(function (error) {
          console.error('Error:', error);
        });

      $scope.transform = function (data) {
        var newData = ['Accuracy'];
        for (var i = 0; i < $scope.reports.length; i++) {
          newData.push($scope.reports[i].accuracyTotal);
        }
        $scope.getChart(newData);
      };

      $scope.getChart = function (data) {
        $scope.chart = c3.generate({
          bindto: '#accuracy-chart',
          data: {
            columns: [
              data
            ]
          }
        });
      };

  }]);
