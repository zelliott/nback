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

      // Upon load from firebase
      User.$loaded()
        .then(function () {
          $scope.reports = User.reports;
          $scope.transform($scope.reports);
        })
        .catch(function (error) {
          console.error('Error:', error);
        });

      $scope.transform = function (data) {
        var accuracyTotal = ['Accuracy'],
          accuracyPosition = ['Position Accuracy'],
          accuracyAudio = ['Audio Accuracy'],
          time = ['Time'];
        for (var i = 0; i < data.length; i++) {
          accuracyTotal.push(data[i].accuracyTotal);
          accuracyPosition.push(data[i].accuracyPosition);
          accuracyAudio.push(data[i].accuracyAudio);
          time.push(moment(data[i].timestamp).format('YYYY-M-D'));
        }

        $scope.getChart(time,
          [accuracyTotal, accuracyPosition, accuracyAudio],
          '#accuracy-chart');
      };

      $scope.getChart = function (time, data, el) {
        $scope.chart = c3.generate({
          bindto: el,
          data: {
            x: 'Time',
            columns: [
              time,
              data[0],
              data[1],
              data[2]
            ],
            types: {
              data: 'area'
            },
            color: function (color, d) {
              if (d.id === data[0][0]) {
                return '#00aced';
              } else if (d.id === data[1][0]) {
                return '#f2a43e';
              } else if (d.id === data[2][0]) {
                return '#00b27f';
              }
            }
          },
          legend: {
            position: 'right'
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
