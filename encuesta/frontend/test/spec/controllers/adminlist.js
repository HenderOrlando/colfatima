'use strict';

describe('Controller: AdminlistCtrl', function () {

  // load the controller's module
  beforeEach(module('colfatimaApp'));

  var AdminlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminlistCtrl = $controller('AdminlistCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AdminlistCtrl.awesomeThings.length).toBe(3);
  });
});
