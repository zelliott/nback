angular.module('firebase.sync', ['firebase'])
  .factory('User', ['$firebaseObject', 'FBURL', 'Auth',
    function ($firebaseObject, FBURL, Auth) {
      var ref = new Firebase(FBURL + '/users/' + Auth.$getAuth().uid);
      return $firebaseObject(ref);
    }
  ]);
