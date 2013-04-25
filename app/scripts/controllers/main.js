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

    function calculate(times) {
        if(!times || !times.length)
            return 100;

        var now = new Date().valueOf();
        var totalMs = now - $scope.startTime;
        var downTime = 0, lookingForDown = true, lastTime = null;
        for(var i = 0, len = times.length; i < len; ++i) {
            if(lookingForDown && !times[i].up) {
                lastTime = times[i].time;
                lookingForDown = false;
            }
            else {
                downTime += (times[i].time - lastTime);
                lookingForDown = true;
            }
        }
        if(!lookingForDown)
            downTime += (now - times[times.length - 1].time);

        var percentage = (totalMs - downTime) * 100 / totalMs;
        console.log(percentage);
        return percentage;
    }

    try {
        $scope.currentlyDown = $scope.times && !$scope.times[$scope.times.length - 1].up;
    } catch(err) { $scope.currentlyDown = false; }

    $scope.uptime = calculate($scope.times);
    setInterval(function() {
        $scope.uptime = calculate($scope.times);
    }, 5000);

    $scope.isUp = function(x) { return x ? 'up' : 'down'; }
  }]);
