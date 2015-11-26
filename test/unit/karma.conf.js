'use strict';

/**
 * karma configuration function
 */
module.exports = function(config) {
  var tests = 'app/states/first/*.spec.js';

  config.set({
    basePath: '../../',
    files: [
      // bower dependencies
      {pattern: 'bower_components/angular/angular.js',
        watched: false, included: true, served: true},
      {pattern: 'bower_components/angular-ui-router/release/angular-ui-router.js',
        watched: false, included: true, served: true},
      {pattern: 'bower_components/angular-mocks/angular-mocks.js',
        watched: false, included: true, served: true},

      // closure base and libs
      {pattern: 'app/goog/base.js', watched: false, included: true, served: true},
      {pattern: 'app/goog/**/*.js', watched: false, included: false, served: true },

      // app unit tests
      // {pattern: 'app/**/*.spec.js', watched: true, included: true, served: true},
      {pattern: 'app/states/first/*.spec.js', watched: true, included: true, served: true},

      // app
      {pattern: 'app/app-deps.js', watched: true, included: true, served: true},
      {pattern: 'app/js/app.js', watched: true, included: true, served: true},

      // templates placeholder
      {pattern: 'app/js/templates.js', watched: true, included: false, served: true},

      // states & components
      {pattern: 'app/states/**/*.js', watched: true, included: false, served: true },
      {pattern: 'app/components/**/*.js', watched: true, included: false, served: true },

    ],
    exclude: [
      'app/externs/**/*',
      'app/**/*.pageobject.js',
      'app/**/*.scenario.js'
    ],
    preprocessors: {
      // tests are preprocessed for dependencies (closure) and for iits
      //'app/**/*.spec.js': ['closure', 'closure-iit'],
      'app/states/first/*.spec.js': ['closure', 'closure-iit'],

      // source files are preprocessed for dependencies
      'app/js/**/*.js': ['closure'],
      'app/states/**/*.js': ['closure'],
      'app/components/**/*.js': ['closure'],

      // external deps
      'app/goog/closure/**/*.js': ['closure-deps']
    },
    plugins: [
      'karma-jasmine',
      'karma-closure',
      'karma-phantomjs-launcher'
    ],
    frameworks: ['jasmine', 'closure'],
    browsers: ['PhantomJS'],
    //logLevel: 'LOG_DEBUG'
    logLevel: 'LOG_WARN'
  });
};
