angular.module('firebase.auth', ['firebase'])
  .factory('Auth', ['$firebaseAuth', 'FBURL',
    function ($firebaseAuth, FBURL) {
      var ref = new Firebase(FBURL);
      return $firebaseAuth(ref);
    }
  ]);
