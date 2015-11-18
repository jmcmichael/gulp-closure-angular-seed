'use strict';
goog.require('my.first.module');
goog.require('my.second.module');
goog.require('my.third.module');

goog.require('my.version.Directive.factory');
goog.require('my.version.Service');
goog.require('my.check.Filter.factory');
goog.require('my.templates');

goog.provide('app');

/**
 * Main app.
 *
 * uses angular bootstrap to ensure goog deps are loaded before app module created
 */
app = angular.element(document).ready(function() {
  angular.module('app', [
      'ui.router',
      my.templates.name,
      my.first.module.name,
      my.second.module.name,
      // my.third.module includes child states `third.one` and `third.two`
      my.third.module.name
    ])
    .config(config)
    .directive('version', my.version.Directive.factory)
    .service('version', my.version.Service)
    .filter('check', my.check.Filter.factory);

  /**
   * Configuration function.
   *
   * @param {ui.router.$stateProvider} $stateProvider
   * @param {ui.router.$urlRouterProvider} $urlRouterProvider
   * @ngInject
   */
  function config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/first');

  }

  /**
   * @ngInject
   */
  angular.bootstrap(document, ['app']);
});


