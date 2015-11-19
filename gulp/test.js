'use strict';

var gulp = require('gulp'),
  path = require('path'),
  unitServer = require('karma').Server,
  e2eServer = require('gulp-angular-protractor'),
  root = require('app-root-path');

gulp.task('test:unit', function(done) {
  new unitServer({
    configFile: root + '/test/unit/karma.conf.js',
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

gulp.task('test', ['test:unit', 'test:e2e']);
