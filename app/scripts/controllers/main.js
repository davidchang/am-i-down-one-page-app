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
    $scope.formatForHeatMap = function() {
        var now = new Date().valueOf();
        var twoWeeksAgo = now - (1000 * 60 * 60 * 24 * 14);
        var startTime = $scope.startTime > twoWeeksAgo ? $scope.startTime : twoWeeksAgo;
        var moodIsUp = true;
        var startIndex = 0;
        if($scope.startTime <= twoWeeksAgo) {
            for(var i = 0, len = $scope.times.length; i < len; ++i) {
                if($scope.times[i] > twoWeeksAgo) {
                    startIndex = i;
                    moodIsUp = $scope.times[i ? i-1 : 0].up;
                    break;
                }
            }
        }

        var data = {};
        
        for(var i = +startTime; i <= +now; i += 60000) {
            /*
            while(startIndex < $scope.times.length && i > $scope.times[startIndex]) {
                moodIsUp = $scope.times[++startIndex].up;
            }
            */
            data[i + ''] = 20; //moodIsUp ? 20 : 10;
        }

        //return $scope.times;
        return data;
    }
  }]);
