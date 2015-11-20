'use strict';

var gulp = require('gulp'),
  del = require('del');

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

gulp.task('clean:tmp', function() {
  return del(['.tmp/**/*']);
});

gulp.task('clean:dist', function() {
  return del(['dist/**/*']);
});

gulp.task('clean:dist:styles', function() {
  return del(['dist/styles/**/*']);
});

gulp.task('clean:dist:lib', function() {
  return del(['dist/lib/**/*']);
});

gulp.task('clean:dist:js', function() {
  return del(['dist/js/**/*']);
});

gulp.task('clean', ['clean:tmp', 'clean:dist']);

require('require-dir')('./gulp');
