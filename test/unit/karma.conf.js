'use strict';

/**
 * karma configuration function
 */
module.exports = function(config) {
  config.set({
    basePath: '../../',
    files: [
      {
        pattern: 'node_modules/babel-polyfill/dist/polyfill.js',
        watched: false,
        included: true,
        served: true
      },

      // NOTE: the following bower deps are auto-generated, do not edit or
      // remove bower/endbower placeholders
      // bower:js
      {pattern: 'bower_components/angular/angular.js', watched: false, included: true, served: true},
      {pattern: 'bower_components/angular-ui-router/release/angular-ui-router.js', watched: false, included: true, served: true},
      {pattern: 'bower_components/angular-mocks/angular-mocks.js', watched: false, included: true, served: true},
      {pattern: 'bower_components/bind-polyfill/index.js', watched: false, included: true, served: true},
      // endbower

      // closure base and libs
      {pattern: 'app/goog/base.js', watched: false, included: true, served: true},
      {pattern: 'app/goog/**/*.js', watched: false, included: false, served: true },

      // app
      {pattern: 'app/utils/register.js', watched: true, included: true, served: true},
      {pattern: 'app/app-deps.js', watched: true, included: true, served: true},
      {pattern: 'app/js/app.js', watched: true, included: true, served: true},

      // templates placeholder
      {pattern: 'app/js/templates.js', watched: true, included: false, served: true},

      // states & components
      {pattern: 'app/states/**/*.js', watched: true, included: false, served: true },
      {pattern: 'app/components/**/*.js', watched: true, included: false, served: true },

      // app unit tests
      {pattern: 'app/**/*.spec.js', watched: true, included: true, served: true}

    ],
    exclude: [
      'app/externs/**/*',
      'app/**/*.pageobject.js',
      'app/**/*.scenario.js'
    ],
    preprocessors: {
      // source files are preprocessed for dependencies
      'app/utils/**/*.js': ['closure', 'babel'],
      'app/js/**/*.js': ['closure', 'babel'],
      'app/states/**/*.js': ['closure', 'babel'],
      'app/components/**/*.js': ['closure', 'babel'],

      // external deps
      'app/goog/closure/**/*.js': ['closure-deps'],

      // bootstrap angular
      'app/index.html': ['ngbootstrapfix'],

      // tests are preprocessed for dependencies (closure) and for it/describe (closure-iit)
      'app/**/*.spec.js': ['closure', 'closure-iit', 'babel']
    },
    plugins: [
      'karma-jasmine',
      'karma-spec-reporter',
      'karma-closure',
      'karma-babel-preprocessor',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-ng-bootstrap-fix-preprocessor'
    ],
    frameworks: ['jasmine', 'closure'],
    browsers: ['PhantomJS_custom'],
    // you can define custom flags
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          }
        },
        flags: ['--load-images=true'],
        debug: false // toggle true, and PhantomJS_custom starts a debug browser
      }
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      }
    },
    reporters: ['spec'],
    specReporter: {
      maxLogLines: 5,         // limit number of lines logged per test
      suppressErrorSummary: true,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true  // do not print information about skipped tests
    },
    logLevel: config.LOG_INFO
  });
};
