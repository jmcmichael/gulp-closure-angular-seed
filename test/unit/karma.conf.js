'use strict';

/**
 * karma configuration function
 */
module.exports = function(config) {
  config.set({
    basePath: '../../',
    files: [
      {pattern: 'bower_components/angular/angular.js', watched: false, included: true, served: true},
      {pattern: 'bower_components/angular-ui-router/release/angular-ui-router.js', watched: false, included: true, served: true},

      {pattern: 'app/goog/base.js', watched: false, included: true, served: true},
      {pattern: 'app/goog/deps.js', watched: false, included: false, served: true },
      {pattern: 'app/app-deps.js', watched: true, included: true, served: true},
      {pattern: 'app/js/app.js', watched: true, included: true, served: true},
      {pattern: 'app/js/templates.js', watched: false, included: false, served: true},
      {pattern: 'app/states/**/*.js', watched: true, included: false, served: true },
      {pattern: 'app/components/**/*.js', watched: true, included: false, served: true },

      {pattern: 'app/**/*.spec.js', watched: true, included: false, served: false}
    ],
    exclude: [
      'app/externs/**/*.*',
      'app/**/*.pageobject.js',
      'app/**/*.scenario.js'
    ],
    preprocessors: {
      //// tests are preprocessed for dependencies (closure) and for iits
      //'app/**/*.spec.js': ['closure', 'closure-iit'],
      //// source files are preprocessed for dependencies
      //'app/**/*.js': ['closure'],
      //// external deps
      //'lib/goog/deps.js': ['closure-deps']
    },
    frameworks: ['mocha', 'chai'],
    browsers: ['PhantomJS'],
    logLevel: 'LOG_DEBUG'
  });
};
