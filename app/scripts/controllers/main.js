'use strict';

angular.module('amIDownOnePageApp')
  .controller('MainCtrl', ['$scope', 'localStorageService', function ($scope, ls) {

      $scope.text = '';

    try {
        $scope.times = JSON.parse(ls.get('times')) || [];
    } catch(err) {
        ls.clearAll(); $scope.times = [];
    }
    $scope.save = function() {
        $scope.times.push({text: $scope.text, time: new Date()});
        ls.add('times', JSON.stringify($scope.times));
        $scope.text = '';
    }
  }]);
