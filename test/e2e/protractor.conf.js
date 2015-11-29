'use strict';

exports.config = {

  specs: [
    'scenarios.js',
    '../../app/states/**/*.scenario.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:9000/',

  rootElement: 'div',

  framework: 'jasmine',
  jasmineNodeOpts: {isVerbose: true},
  onPrepare: function() {
      require('jasmine-spec-reporter');
      jasmine.getEnv().addReporter(new jasmine.SpecReporter());
   }

};
