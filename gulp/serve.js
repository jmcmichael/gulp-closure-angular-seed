'use strict';

var gulp = require('gulp'),
  glob = require('globby').sync,
  path = require('path'),
  debug = require('gulp-debug'),
  server = require('browser-sync');

gulp.task('serve', ['build'], function() {
  server.init({
    server: {
      baseDir: "app"
    }
  });
});
