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

      $scope.transform = function (reports) {
        $scope.accuracyData = ['Accuracy'];
        for (var i = 0; i < $scope.reports.length; i++) {
            $scope.accuracyData.push($scope.reports[i].accuracyTotal);
        }
        $scope.getChart($scope.accuracyData)
      };

      $scope.getChart = function (data) {
        $scope.chart = c3.generate({
          bindto: '#accuracy-chart',
          data: {
            columns: [
              $scope.accuracyData
            ]
          }
        });
      };

  }]);
