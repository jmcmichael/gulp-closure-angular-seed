'use strict';

goog.require('my.version.Service');
goog.require('my.version.Directive.factory');
goog.require('my.check.Filter.factory');
goog.provide('my.components.module');

/**
 * Components module
 *
 * @return {angular.Module}
 */
my.components.module = angular.module('components', []);

/**
 * Init components module.
 */
my.components.module
  .directive('version', my.version.Directive.factory)
  .service('version', my.version.Service)
  .filter('check', my.check.Filter.factory);
