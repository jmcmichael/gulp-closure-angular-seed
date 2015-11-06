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
    'closure/library/**/*.js'
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