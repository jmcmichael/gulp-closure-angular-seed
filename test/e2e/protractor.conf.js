'use strict';

exports.config = {

  specs: [
    'scenarios.js',
    '../../app/states/**/*.scenario.js'
  ],

  capabilities: {
    browserName: 'chrome',
    name: 'test:e2e'
  },

  baseUrl: 'http://localhost:9000/',

  rootElement: 'div',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 120000,
    showColors: true,
    isVerbose: true,
    includeStackTrace: true
  },

  //onPrepare: function() {
  //    require('jasmine-spec-reporter');
  //    jasmine.getEnv().addReporter(new jasmine.SpecReporter());
  // }

};
