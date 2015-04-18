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
        console.log(data);
        var newData = ['Accuracy'],
          time = ['Time'];
        for (var i = 0; i < data.length; i++) {
          newData.push(data[i].accuracyTotal);
          time.push(moment(data[i].timestamp).format('YYYY-M-D'));
        }
        $scope.getChart(time, newData);
      };

      $scope.getChart = function (time, data) {
        $scope.chart = c3.generate({
          bindto: '#accuracy-chart',
          data: {
            x: 'Time',
            columns: [
              time,
              data
            ],
            types: {
              data: 'area'
            },
            color: function () {
              return '#00aced';
            }
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%Y-%m-%d'
              }
            }
          }
        });
      };

  }]);
