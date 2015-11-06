'use strict';

var gulp = require('gulp'),
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
  libs: [
    'node_modules/closure-library/closure/goog/base.js',
    'node_modules/closure-library/closure/goog/deps.js'
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

//gulp.task('default', ['clean:tmp'], function () {
//  gulp.start('build');
//});

require('require-dir')('./gulp');