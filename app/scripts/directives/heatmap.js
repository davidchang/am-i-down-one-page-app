'use strict';

angular.module('amIDownOnePageApp')
  .directive('heatmap', function () {
    return {
      template: '<div id="heatmap"></div>',
      restrict: 'E',
      scope: { startTime: '@', data: '=' },
      link: function postLink(scope, element, attrs) {
        var now = new Date();
        var twoWeeksAgo = now.valueOf() - (1000 * 60 * 60 * 24 * 14);

        function formatTimeData(scopeStartTime, times) {
            var startTime = scopeStartTime > twoWeeksAgo ? scopeStartTime : twoWeeksAgo;
            var moodIsUp = true;
            var startIndex = 0;
            if(scopeStartTime <= twoWeeksAgo) {
                for(var i = 0, len = times.length; i < len; ++i) {
                    if(times[i] > twoWeeksAgo) {
                        startIndex = i;
                        moodIsUp = times[i ? i-1 : 0].up;
                        break;
                    }
                }
            }

            var toReturn = {};
            
            for(var i = parseInt(+startTime / 1000), target = parseInt(+now / 1000); i <= target; i += 3600) {
                while(startIndex < times.length && i > times[startIndex]) {
                    moodIsUp = times[++startIndex].up;
                }
                toReturn[i + ''] = moodIsUp ? 20 : 10;
            }

            return toReturn;
        }

        function init() {
            var cal = new CalHeatMap();
            cal.init({
              id: 'heatmap',
              domain: 'day',
              subDomain: 'hour',
              range: 14,
              data: formatTimeData(scope.startTime, scope.data),
              start: twoWeeksAgo,
              weekStartOnMonday: 0,
              displayScale: false,
              scale: [10, 20]
            });
        }
        init();
      }
    };
  });
