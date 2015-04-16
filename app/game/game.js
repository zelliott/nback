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
      GameService.start($scope.user.game);
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

    this.audioMap = {
      0: 'A',
      1: 'B',
      2: 'C',
      3: 'D',
      4: 'E',
      5: 'F',
      6: 'G',
      7: 'H',
      8: 'I'
    };

    this.sequence = [

    ];

    // Unimplemented
    this.init = function () {

    }

    this.reset = function () {
      this.sequence.empty();
    }

    this.start = function (data) {

      this.generateSequence(data);

      for (var i = 0; i < this.sequence.length; i++) {
        this.step();
        this.waitForResponse();
      }


    };

    // Randomly generate sequence of positions & audios
    this.generateSequence = function (data) {
      var trials = data.trials,
          n = data.level;

      for (var i = 0; i < trials; i++) {
        var trial = {};
        trial.position = Math.floor(Math.random() * 8);
        trial.audio = this.audioMap[Math.floor(Math.random() * 8)];

        // If we won't be out of the sequence
        if (i - n >= 0) {

          // If position match
          console.log(this.sequence[i-n]);
          if (this.sequence[i - n].position === trial.position) {
            trial.answer = {
              position: true,
              audio: false
            }
          } else {
            trial.answer = {
              position: false,
              audio: false
            }
          }

          // If audio match
          if (this.sequence[i - n].audio === trial.audio) {
            trial.answer.audio = true;
          }
        }

        this.sequence.push(trial);
      }

      console.log(this.sequence);
    };

    this.step = function () {

    };

    this.waitForResponse = function () {

    };

  });
