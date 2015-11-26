describe('app', function() {

  var ctrl;

  beforeEach(module('app'));

  beforeEach(inject(function($injector) {

    var $rootScope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');

    ctrl = $controller('FirstCtrl', {
      $scope: $rootScope.$new()
    });
  }));

  it('should set the default value of "animals" model', function() {
    expect(ctrl.animals).toEqual(['dog', 'cat', 'mouse']);
  });

});

describe('main', function() {
  it('should call through a(), b() and sum', function() {
    expect(main(1, 2)).toBe(7);
  })
});