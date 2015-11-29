/** test/unit/karma-build.conf.js
 * Karma configuration function for testing compiled app
 */
'use strict';
module.exports = function(config) {
  config.set({
    basePath: '../../',
    files: [
      // TODO: use gulp-inject to generate bower deps
      // bower dependencies
      {pattern: 'bower_components/angular/angular.js',
        watched: false, included: true, served: true},
      {pattern: 'bower_components/angular-ui-router/release/angular-ui-router.js',
        watched: false, included: true, served: true},
      {pattern: 'bower_components/angular-mocks/angular-mocks.js',
        watched: false, included: true, served: true},
      {pattern: 'bower_components/bind-polyfill/index.js',
        watched: false, included: true, served: true},

      // app
      {pattern: 'dist/app/js/app.min-*.js', watched: true, included: true, served: true},

      // app unit tests
      {pattern: 'app/**/*.spec.js', watched: true, included: true, served: true}

    ],
    exclude: [
      'app/externs/**/*',
      'app/**/*.pageobject.js',
      'app/**/*.scenario.js'
    ],
    preprocessors: {
      // bootstrap angular
      'dist/app/index.html': ['ngbootstrapfix'],

      // tests are preprocessed for dependencies (closure) and for it/describe (closure-iit)
      'app/**/*.spec.js': ['closure', 'closure-iit']
    },
    plugins: [
      'karma-jasmine',
      'karma-spec-reporter',
      'karma-closure',
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
