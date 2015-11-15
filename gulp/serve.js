'use strict';

var gulp = require('gulp'),
  glob = require('globby').sync,
  path = require('path'),
  debug = require('gulp-debug'),
  server = require('browser-sync');

gulp.task('serve', ['dev:inject'], function() {
  server.init({
    server: {
      baseDir: ['app', '.tmp', 'bower_components']
    }
  });
});

gulp.task('serve:dist', ['build'], function() {
  server.init({
    server: {
      baseDir: "dist/app"
    }
  });
});

