/** gulp/test.js
 *
 **/
'use strict';

var gulp = require('gulp'),
  conf = require('./_conf.js').conf,
  path = require('path'),
  debug = require('gulp-debug'),
  wiredep = require('wiredep').stream,
  inject = require('gulp-inject'),
  order = require('gulp-order'),
  es = require('event-stream'),
  unitServer = require('karma').Server,
  e2eServer = require('gulp-angular-protractor'),
  root = require('app-root-path');

gulp.task('test:unit', ['dev:prep:app-deps', 'prep:copylibs'], function(done) {
  new unitServer({
    configFile: root + '/test/unit/karma.conf.js',
    singleRun: true,
    client: {
      captureConsole: false
    }
  }, done).start();
});

gulp.task('test:unit:remote', ['dev:prep:app-deps', 'prep:copylibs'], function(done) {
  new unitServer({
    configFile: root + '/test/unit/karma-remote.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test:unit:dist', ['build'], function(done) {
  new unitServer({
    configFile: root + '/test/unit/karma-build.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test:unit:dist:remote', ['build'], function(done) {
  new unitServer({
    configFile: root + '/test/unit/karma-build-remote.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test:e2e', ['serve'], function(callback) {
  gulp
    .src([root + '/test/e2e/scenarios.js', root + '/app/states/**/*.scenario.js'])
    .pipe(e2eServer({
      'configFile': root + '/test/e2e/protractor.conf.js',
      'debug': false,
      'autoStartStopServer': true
    }))
    .on('error', function(e) {
      console.log(e);
    })
    .on('end', callback);
});

gulp.task('test:e2e:remote', ['serve'], function(callback) {
  gulp
    .src([root + '/test/e2e/scenarios.js', root + '/app/states/**/*.scenario.js'])
    .pipe(e2eServer({
      'configFile': root + '/test/e2e/protractor-remote.conf.js',
      'debug': false,
      'autoStartStopServer': true
    }))
    .on('error', function(e) {
      console.log(e);
    })
    .on('end', callback);
});

gulp.task('test', ['test:unit', 'test:e2e']);
