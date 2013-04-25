'use strict';

angular.module('amIDownOnePageApp')
  .controller('MainCtrl', ['$scope', 'localStorageService', function ($scope, ls) {

    if(ls.get('startTime')) {
      $scope.startTime = ls.get('startTime');
    }
    else {
        $scope.startTime = new Date().valueOf();
        ls.add('startTime', new Date().valueOf());
    }

      $scope.text = '';

    try {
        $scope.times = JSON.parse(ls.get('times')) || [];
        console.log($scope.times);
    } catch(err) {
        ls.clearAll(); $scope.times = [];
    }

    var moodChange = function(isUp) {
        //todo: delete
        if($scope.text == 'clear') {
            ls.clearAll();
            return;
        }
        $scope.times.push({text: $scope.text, time: new Date().valueOf(), up: isUp});
        ls.add('times', JSON.stringify($scope.times));
        $scope.text = '';
        $scope.currentlyDown = !$scope.currentlyDown;
    }

    $scope.moodDown = function() {
        moodChange(false);
    }
    $scope.moodUp = function() {
        moodChange(true);
    }

    try {
        $scope.currentlyDown = $scope.times && !$scope.times[$scope.times.length - 1].up;
    } catch(err) { $scope.currentlyDown = false; }

    $scope.isUp = function(x) { return x ? 'up' : 'down'; }
  }]);
