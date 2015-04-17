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
      KeyboardService.init();
      GameService.reset();
    };

    $scope.start = function () {
      GameService.start($scope.user.game);
    };

    $scope.quit = function () {
      GameService.reset();
    };

    $scope.pause = function () {
      GameService.pause();
    };

    $scope.resume = function () {
      GameService.resume();
    };

    $scope.paused = function () {
      return GameService.paused;
    };

    $scope.gameMode = function () {
      return GameService.gameMode;
    };

    $scope.board = function () {
      return GameService.board;
    };

    // Not working
    $scope.remaining = function () {
      return GameService.remaining;
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
      this.eventHandlers = [];
      $document.bind('keydown', function (e) {
        var key = keyMap[e.which];

        if (key) {
          e.preventDefault();
          self.handleEvent(key, e);
        }
      });
    };

    this.on = function (cb) {
      this.eventHandlers = [cb];
    };

    this.handleEvent = function (key, e) {
      var callbacks = this.eventHandlers;
      if (!callbacks) {
        return;
      }

      e.preventDefault();

      if (callbacks) {
        for (var i = 0; i < callbacks.length; i++) {
          var cb = callbacks[i];
          cb(key, e);
        }
      }
    };

  })

  .service('GameService', function ($interval, $timeout, ngAudio, KeyboardService) {

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

    this.sequence = [];
    this.board = [];

    this.reset = function () {
      this.paused = false;
      this.gameMode = false;
      this.sequence = [];
      this.resetBoard();
    }

    this.start = function (data) {
      this.gameMode = true;
      this.generateSequence(data);
      this.remaining = data.trials;

      var i = 0,
        self = this;

      var gameLoop = $interval(function () {

        // If we're not in the game mode any more, cancel the loop
        if (!self.gameMode) {
          $interval.cancel(gameLoop);

        // Otherwise, step through the loop again
        } else {
          self.step(i);

          // Monitor for keypresses
          var that = self,
            j = i;
          KeyboardService.on(function (key) {
            if (key === 'A') {
              that.sequence[j].player.position = true;
              $('#controls .left').addClass('control-on');
              $timeout(function () {
                $('#controls .left').removeClass('control-on');
              }, 250);
            } else if (key === 'L') {
              that.sequence[j].player.audio = true;
              $('#controls .right').addClass('control-on');
              $timeout(function () {
                $('#controls .right').removeClass('control-on');
              }, 250);
            }
          });

          // Update remaining & i
          that.remaining--;
          i++;
        }
      }, data.time, data.trials);

      // If we have none remaining
      if (this.remaining === 0) {
        
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

        // If we're still in the sequence
        if (i - n >= 0) {

          // If position match
          if (this.sequence[i - n].position === trial.position) {
            trial.answer = {
              position: true,
              audio: false
            };
          } else {
            trial.answer = {
              position: false,
              audio: false
            };
          }

          // If audio match
          if (this.sequence[i - n].audio === trial.audio) {
            trial.answer.audio = true;
          }
        }

        trial.player = {
          position: false,
          audio: false
        };

        this.sequence.push(trial);
      }
    };

    this.pause = function () {
      this.paused = true;
    };

    this.resume = function () {
      this.paused = false;
    };

    this.step = function (i) {
      this.board[this.sequence[i].position].on = true;

      var self = this;
      $timeout(function () {
        self.board[self.sequence[i].position].on = false;
      }, 1000);
    };

    this.waitForAnswer = function () {

    };

    this.resetBoard = function () {
      this.board = [];
      for (var i = 0; i <= 8; i++) {
        this.board.push({ on: false });
      }
    };

  });
