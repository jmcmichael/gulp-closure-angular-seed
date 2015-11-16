'use strict';
root = require('app-root-path');

var conf = {
  scripts: {
    build: [
      'app/js/**/*.js',
      'app/states/**/*.js',
      'app/components/**/*.js',
      '.tmp/templateCache/*.js',

      // no template
      '!app/js/templates.js',

      // no goog lib
      '!app/goog/**/*.js',

      // no tests
      '!**/*.pageobject.js',
      '!**/*.scenario.js',
      '!**/*.spec.js'
    ],
    dev: [
      'app/js/**/*.js',
      'app/states/**/*.js',
      'app/components/**/*.js',
      '!app/goog/**/*.js',
      '!**/*.pageobject.js',
      '!**/*.scenario.js',
      '!**/*.spec.js'
    ]
  },
  goog: [
    'app/goog/base.js',
    'app/goog/deps.js'
  ],
  externs: [
    'closure/externs/*.js'
  ],
  styles: [
    'app/**/*.styl'
  ],
  templates: [
    'app/**/*.tpl.html'
  ],
  dirs: {
    temp: root + '/.tmp',
    dist: root + '/dist',
    app: root + '/app'
  },
  index: root + '/app/index.html'
};

exports.conf = conf;