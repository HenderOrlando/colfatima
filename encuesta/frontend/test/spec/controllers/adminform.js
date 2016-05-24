'use strict';

describe('Controller: AdminformCtrl', function () {

  // load the controller's module
  beforeEach(module('colfatimaApp'));

  var AdminformCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminformCtrl = $controller('AdminformCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AdminformCtrl.awesomeThings.length).toBe(3);
  });
});
