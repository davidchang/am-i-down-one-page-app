'use strict';

describe('Directive: heatmap', function () {
  beforeEach(module('amIDownOnePageApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<heatmap></heatmap>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the heatmap directive');
  }));
});
