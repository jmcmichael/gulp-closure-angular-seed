'use strict';

/**
 * karma configuration function
 */
module.exports = function(config) {
  var tests = 'app/states/first/*.spec.js';

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

      // closure base and libs
      {pattern: 'app/goog/base.js', watched: false, included: true, served: true},
      {pattern: 'app/goog/**/*.js', watched: false, included: false, served: true },

      // app
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
      'app/js/**/*.js': ['closure'],
      'app/states/**/*.js': ['closure'],
      'app/components/**/*.js': ['closure'],

      // external deps
      'app/goog/closure/**/*.js': ['closure-deps'],

      // bootstrap angular
      'app/index.html': ['ngbootstrapfix'],

      // tests are preprocessed for dependencies (closure) and for it/describe (closure-iit)
      'app/**/*.spec.js': ['closure', 'closure-iit']
    },
    plugins: [
      'karma-jasmine',
      'karma-closure',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-ng-bootstrap-fix-preprocessor'
    ],
    frameworks: ['jasmine', 'closure'],
    browsers: ['PhantomJS', 'PhantomJS_custom'],
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
    logLevel: 'LOG_INFO' // _DISABLE, _ERROR, _WARN, _INFO (default), _DEBUG
  });
};
