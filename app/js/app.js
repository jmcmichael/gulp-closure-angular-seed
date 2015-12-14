'use strict';
goog.require('my.first.module');
goog.require('my.second.module');
goog.require('my.third.module');
goog.require('my.components.module');

goog.require('my.templates');

goog.provide('app');

/**
 * Main app.
 *
 * uses angular bootstrap to ensure goog deps are loaded before app module created
 */
angular.element(document).ready(function() {
  angular.module('app', [
      'ui.router',
      my.templates.name,
      my.components.module.name,
      my.first.module.name,
      my.second.module.name,
      // my.third.module includes child states `third.one` and `third.two`
      my.third.module.name
    ])
    .config(config);

  /**
   * Configuration function.
   *
   * @param {ui.router.$stateProvider} $stateProvider
   * @param {ui.router.$urlRouterProvider} $urlRouterProvider
   * @ngInject
   */
  function config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/first');

    var arr = [0,1,2,3,4,5];

    arr.map((n) => { console.log('n: ' + n)});

  }

  angular.bootstrap(document, ['app']);
});


