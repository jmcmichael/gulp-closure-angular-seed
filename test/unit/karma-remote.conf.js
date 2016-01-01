/** test/unit/karma-remote.conf.js
 * Karma remote testing configuration function
 */
'use strict';
var fs = require('fs');

module.exports = function(config) {

  // Use ENV vars on Travis and sauce.json locally to get credentials
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('test/sauce.json')) {
      console.log('Create a test/sauce.json with your credentials based ' +
        'on the test/sauce.tpl.json file.');
      process.exit(1);
    } else {
      process.env.SAUCE_USERNAME = require('./sauce').username;
      process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
    }
  }

  var customLaunchers = {
    //sl_chrome: {
    //  base: 'SauceLabs',
    //  browserName: 'chrome',
    //  platform: 'Windows 7',
    //  version: '35'
    //},
    //sl_firefox: {
    //  base: 'SauceLabs',
    //  browserName: 'firefox',
    //  version: '30'
    //},
    sl_ios_safari: {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '9.1'
    },
    //sl_osx_safari: {
    //  base: 'SauceLabs',
    //  browserName: 'safari',
    //  platform: 'OS X 10.10',
    //  version: '8.0'
    //},
    //sl_ie_11: {
    //  base: 'SauceLabs',
    //  browserName: 'internet explorer',
    //  platform: 'Windows 8.1',
    //  version: '11'
    //},
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '10'
    }
  };

  config.set({
    basePath: '../../',
    files: [
      {
        pattern: 'node_modules/babel-polyfill/dist/polyfill.js',
        watched: false,
        included: true,
        served: true
      },

      // NOTE: karma file config objects auto-generated, do not edit or
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
      'karma-ng-bootstrap-fix-preprocessor',
      'karma-sauce-launcher'
    ],
    frameworks: ['jasmine', 'closure'],
    browsers: Object.keys(customLaunchers),
    customLaunchers: customLaunchers,
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      }
    },
    reporters: ['spec', 'saucelabs'],
    sauceLabs: {
      testName: 'Karma and Sauce Labs demo'
    },
    captureTimeout: 120000,
    specReporter: {
      maxLogLines: 5,         // limit number of lines logged per test
      suppressErrorSummary: true,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true  // do not print information about skipped tests
    },
    logLevel: config.LOG_INFO // DISABLE, ERROR, WARN, INFO (default), DEBUG
  });
};
