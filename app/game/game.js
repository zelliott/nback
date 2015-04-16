angular.module('app.game', ['ngRoute', 'ngAudio', 'firebase.sync'])

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
    ['currentAuth', '$scope', 'GameService', 'KeyboardService', 'User',
    function (currentAuth, $scope, GameService, KeyboardService, User) {

    // Save user to scope
    $scope.user = User;

    // Upon load from firebase, initialize the game
    $scope.user.$loaded()
      .then(function () {
        $scope.init();
      })
      .catch(function (error) {
        console.error("Error:", error);
      });

    $scope.init = function () {
      $scope.gameMode = false;
      KeyboardService.init();
      GameService.init();

      // Build board
    };

    $scope.start = function () {
      $scope.gameMode = true;
      GameService.start();
    };

    $scope.pause = function () {

    };

    $scope.quit = function () {
      $scope.gameMode = false;
      GameService.reset();
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

    // Unimplemented
    this.init = function () {

    }

    this.reset = function () {
      this.sequence.empty();
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
