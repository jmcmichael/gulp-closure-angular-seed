'use strict';

var gulp = require('gulp'),
  glob = require('globby').sync,
  path = require('path'),
  debug = require('gulp-debug'),
  root = require('app-root-path'),
  server = require('browser-sync');

gulp.task('serve', ['dev:inject'], function() {
  server({
    notify: false,
    directory: true,
    port: 9000,
    server: {
      baseDir: ['app', '.tmp'],
      routes: {
        '/bower_components': './bower_components'
      }
    }
  });

  //server.init({
  //  server: {
  //    baseDir: ['.tmp', 'app', 'bower_components'],
  //    routes: {
  //      '/bower_components': 'bower_components',
  //      '/goog': 'goog',
  //    },
  //    directory: true
  //  }
  //});
});

gulp.task('serve:dist', ['build'], function() {
  server.init({
    server: {
      baseDir: "dist/app"
    }
  });
});

