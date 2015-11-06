root = require('app-root-path');

var conf = {
  scripts: [
    'app/js/app.js',
    'app/states/**/*.js',
    'app/components/**/*.js',
    '!**/*.pageobject.js',
    '!**/*.scenario.js',
    '!**/*.spec.js'
  ],
  goog: [
    'node_modules/google-closure-library/closure/goog/base.js',
    'node_modules/google-closure-library/closure/goog/deps.js'
  ],
  externs: [
    'closure/externs/*.js'
  ],
  styles: [
    'app/**/*.sass'
  ],
  partials: [
    'app/**/*.tpl.html'
  ],
  dirs: {
    temp: root + '/.tmp',
    dist: root + '/dist'
  }
};

exports.conf = conf;