'use strict';

goog.provide('my.first.Ctrl');

/**
 * First controller.
 *
 * @constructor
 */
my.first.Ctrl = function() {

  /**
   * @type {Array}
   * @export
   */
  this.animals = ['dog', 'cat', 'mouse'];

  /**
   * @type {String}
   * @export
   */
  this.hello = 'hello';

  let range = [1,2,3,4,5]

  this.range = range.map((int) => { return int })

};
