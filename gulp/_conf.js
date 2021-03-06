'use strict';
var root = require('app-root-path');

/**
 * conf provides file globs for build/dev workflow tasks
 */
module.exports.conf = {
  scripts: {
    build: [
      'app/libs/**/*.js',
      'app/js/**/*.js',
      'app/states/**/*.js',
      'app/components/**/*.js',
      '.tmp/templateCache/*.js',

      // no templates
      '!app/js/templates.js',

      // no goog libs
      '!app/goog/**/*.js',

      // no tests
      '!**/*.pageobject.js',
      '!**/*.scenario.js',
      '!**/*.spec.js'
    ],
    dev: [
      'app/libs/**/*.js',
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
    'app/externs/**/*.js'
  ],
  styles: [
    'app/**/*.styl'
  ],
  templates: [
    'app/**/*.tpl.html',
  ],
  lib: 'bower_components',
  dirs: {
    temp: root + '/.tmp',
    dist: root + '/dist',
    app: root + '/app',
    libs: root + '/app/libs'
  },
  index: root + '/app/index.html',
  calcDeps: {
    exec: root + '/node_modules/google-closure-library/closure/bin/calcdeps.py',
    fileName: 'app-deps.js',
    roots: [
      {
        root: 'app',
        prefix: 'app/'
      },
      {
        root: 'states',
        prefix: 'states/'
      },
      {
        root: 'components',
        prefix: 'components/'
      }
    ]
  },
  depsWriter: {
    exec: root + '/node_modules/google-closure-library/closure/bin/build/depswriter.py',
    fileName: 'app-deps.js',
    roots: [
      {
        root: 'app',
        prefix: 'app/'
      },
      {
        root: 'states',
        prefix: 'states/'
      },
      {
        root: 'components',
        prefix: 'components/'
      }
    ]
  }
};
