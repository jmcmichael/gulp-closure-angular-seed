'use strict';

var gulp = require('gulp'),
  glob = require('globby').sync,
  path = require('path'),
  debug = require('gulp-debug'),
  server = require('browser-sync');

gulp.task('serve', function() {
  server.init({
    server: {
      baseDir: "app"
    }
  });
});

gulp.task('serve:dist', function() {
  server.init({
    server: {
      baseDir: "dist/app"
    }
  });
});

