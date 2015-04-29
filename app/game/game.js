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

    // If not logged in, load default game statistics
    var defaultGame = {
      level: 2,
      trials: 30,
      time: 3000
    };

    // Save user to scope
    $scope.user = User;

    // Upon load from firebase, initialize the game
    $scope.user.$loaded()
      .then(function () {
        $scope.init();
        User.game = (User.game === undefined) ? defaultGame : User.game;
      })
      .catch(function (error) {
        console.error('Error:', error);
      });

    /**
     * The following methods do exactly what their method titles
     * say they do... literally the most self-explanatory group of methods
     */

    $scope.init = function () {
      KeyboardService.init();
      GameService.reset();
    };

    $scope.start = function () {
      if ($scope.user.game === undefined) {
        GameService.start(defaultGame);
      } else {
        GameService.start($scope.user.game);
      }
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

    $scope.remaining = function () {
      return GameService.remaining;
    };

  }])

  // Handle keyboard events
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

  .service('GameService', function ($interval, $timeout, ngAudio, KeyboardService, User) {

    // Create audio map
    this.audioMap = {
      0: 'B',
      1: 'F',
      2: 'K',
      3: 'N',
      4: 'P',
      5: 'Q',
      6: 'R',
      7: 'T'
    };

    this.sequence = [];
    this.board = [];

    // Reset game
    this.reset = function () {
      this.paused = false;
      this.gameMode = false;
      this.sequence = [];
      this.resetBoard();
    }

    // Start game
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

        } else if (self.paused) {
          var pauseTimer = $timeout(function () {
              if (!self.paused) {
                $timeout.cancel(pauseTimer);
              }
          }, 100000);

        // Otherwise, step through the loop again
        } else {
          self.step(i);

          // Monitor for keypresses
          var that = self,
            j = i;
          KeyboardService.on(function (key) {

            // Position Match
            if (key === 'A') {
              that.sequence[j].player.position = true;
              $('#controls .left').addClass('control-on');
              $timeout(function () {
                $('#controls .left').removeClass('control-on');
              }, 250);

            // Location Match
            } else if (key === 'L') {
              that.sequence[j].player.audio = true;
              $('#controls .right').addClass('control-on');
              $timeout(function () {
                $('#controls .right').removeClass('control-on');
              }, 250);

            // Pause game
            } else if (key === 'P') {
              self.paused = !self.paused;

            // Exit game
            } else if (key === 'ESC') {
              self.gameMode = false;
            }
          });

          // Update remaining & i
          that.remaining--;
          i++;
        }
      }, data.time, data.trials);

      // If game is completed
      gameLoop.then(function () {
        var gameCompleted = (self.remaining === 0);
        if (gameCompleted) {
          self.generateReport();
        }

        // Reset game
        self.reset();
      });
    };

    // Randomly generate sequence of positions & audios
    this.generateSequence = function (data) {
      var trials = data.trials,
          n = data.level;

      // For each trial
      for (var i = 0; i < trials; i++) {

        // Generate a random position and audio
        var trial = {};
        trial.position = Math.floor(Math.random() * 8);
        trial.audio = this.audioMap[Math.floor(Math.random() * 7)];

        // If we're still in the sequence
        if (i - n >= 0) {

          // Determine correct position nanswer
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

          // Determine correct audio answer
          if (this.sequence[i - n].audio === trial.audio) {
            trial.answer.audio = true;
          }
        } else if (i == 0) {
          trial.answer = {
            position: false,
            audio: false
          };
        }

        // Set default player response
        trial.player = {
          position: false,
          audio: false
        };

        // Add trial to sequence
        this.sequence.push(trial);
      }
    };

    // Pause game
    this.pause = function () {
      this.paused = true;
    };

    // Resume game
    this.resume = function () {
      this.paused = false;
    };

    // Step through the game
    this.step = function (i) {
      this.board[this.sequence[i].position].on = true;
      ngAudio.play('assets/audio/' + (this.sequence[i].audio).toLowerCase() + '.mp3');
      var self = this;
      $timeout(function () {
        self.board[self.sequence[i].position].on = false;
      }, 1000);
    };

    // Reset the game board
    this.resetBoard = function () {
      this.board = [];
      for (var i = 0; i <= 8; i++) {
        this.board.push({ on: false });
      }
    };

    // Generate report
    this.generateReport = function () {

      // Report template
      var report = {
        total: this.sequence.length,
        correctPosition: 0,
        incorrectPosition: 0,
        accuracyPosition: 0,
        correctAudio: 0,
        incorrectAudio: 0,
        accuracyAudio: 0,
        accuracyTotal: 0,
        timestamp: moment().format()
      }

      // Calculate report statistics
      for (var i = 0; i < this.sequence.length; i++) {
        var trial = this.sequence[i];
        if (trial.answer.position === trial.player.position) {
          report.correctPosition++;
        }

        if (trial.answer.audio === trial.player.audio) {
          report.correctAudio++;
        }
      }

      report.incorrectPosition = report.total - report.correctPosition;
      report.accuracyPosition = (report.correctPosition / report.total).toFixed(2);
      report.incorrectAudio = report.total - report.correctAudio;
      report.accuracyAudio = (report.correctAudio / report.total).toFixed(2);
      report.accuracyTotal = ((report.correctPosition + report.correctAudio) /
        (report.total * 2)).toFixed(2);

      // Save report
      if (User.reports !== undefined) {
        console.log(User.reports);
        User.reports.push(report);
      } else {
        User.reports = [report];
      }

      User.$save().then(function (ref) {
        console.log('Success: ', ref);
      }, function (error) {
        console.log('Error:', error);
      });
    };
  });
