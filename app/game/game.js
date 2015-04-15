angular.module('app.game', ['ngRoute', 'ngAudio'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
      controller: 'GameCtrl',
      templateUrl: 'game/game.html',

      // Require authentication for this page
      resolve: {
        'currentAuth': ['Auth', function (Auth) {
          return Auth.$requireAuth();
        }]
      }
    });
  }])

  .controller('GameCtrl',
    ['currentAuth', '$scope', 'GameService', 'KeyboardService',
    function (currentAuth, $scope, GameService, KeyboardService) {

    $scope.init = function () {

      // Build board
      // Grab user settings
    };

    $scope.start = function () {
      GameService.start();
    };

  }])

  .service('KeyboardService', function ($document, ngAudio) {

    var keyMap = {
      65: 'A',
      76: 'L',
      80: 'P',
      27: 'ESC'
    };

    this.init = function () {
      var self = this;
      this.keyEventHandlers = [];
      $document.bind('keydown', function (evt) {
        var key = keyMap[evt.which];

        if (key) {
          // An interesting key was pressed
          evt.preventDefault();
          self._handleKeyEvent(key, evt);
        }
      });
    };

  })

  .service('GameService', function ($timeout, ngAudio) {

    this.sequence = [

    ];

    this.init = function () {

    }

    this.start = function () {

      this.generateSequence();

      for (var i = 0; i < sequence.length; i++) {
        this.step();
        this.waitForResponse();
      }


    };

    this.generateSequence = function () {
      // Randomly generate sequence of positions & audios
    };

    this.step = function () {

    };

    this.waitForResponse = function () {

    };

  });
