'use strict';
root = require('app-root-path');

var conf = {
  scripts: {
    build: [
    'app/js/**/*.js',
      '!app/js/templates.js',
      'app/states/**/*.js',
      'app/components/**/*.js',
      '.tmp/templateCache/*.js',
      '!**/*.pageobject.js',
      '!**/*.scenario.js',
      '!**/*.spec.js'
    ],
    dev: [
      'node_modules/google-closure-library/**/base.js',
      'node_modules/google-closure-library/**/deps.js',
      'app/js/**/*.js',
      'app/states/**/*.js',
      'app/components/**/*.js',
      '!**/*.pageobject.js',
      '!**/*.scenario.js',
      '!**/*.spec.js'
    ]
  },
  goog: [
    'node_modules/google-closure-library/closure/goog/base.js',
    'node_modules/google-closure-library/closure/goog/deps.js'
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
    dist: root + '/dist'
  },
  index: root + '/app/index.html'
};

exports.conf = conf;