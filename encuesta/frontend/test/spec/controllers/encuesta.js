'use strict';

describe('Controller: EncuestaCtrl', function () {

  // load the controller's module
  beforeEach(module('colfatimaApp'));

  var EncuestaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EncuestaCtrl = $controller('EncuestaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EncuestaCtrl.awesomeThings.length).toBe(3);
  });
});
