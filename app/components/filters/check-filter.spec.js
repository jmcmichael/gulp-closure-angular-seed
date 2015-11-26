'use strict';

describe('check filter', function() {

  beforeEach(module('components'));

  it('should convert boolean values', inject(function(checkFilter) {
    expect(checkFilter(true)).toBe('\u2714');
    expect(checkFilter(false)).toBe('\u2718');
  }));

});
