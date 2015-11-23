'use strict';

/**
 * karma configuration function
 */
module.exports = function(config) {
  config.set({

    basePath: '../../',

    frameworks: ['jasmine'],

    /* inject:files */ files: [
      'app/goog/base.js',
      'app/app-deps.js',
      'app/js/app.js'
    ],

    exclude: [
      'app/states/**/*.pageobject.js',
      'app/states/**/*.scenario.js'
    ],

    autoWatch: false,

    browsers: ['Firefox'],

    singleRun: true,

    preprocessors: {
      //'app/js/app.js': 'coverage',
      //'app/states/**/!(*.pageobject|*.scenario|*.spec).js': 'coverage',
      //'app/components/**/!(*.spec).js': 'coverage'
    },

    reporters: ['spec']
    //
    //,coverageReporter: {
    //  type: 'html',
    //  dir: 'test/unit/coverage/'
    //}

  });
};
