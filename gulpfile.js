'use strict';

var gulp = require('gulp'),
  del = require('del');

//gulp.task('default', ['clean:tmp'], function () {
//  gulp.start('build');
//});

gulp.task('clean:tmp', function() {
  return del(['.tmp/**/*']);
});

gulp.task('clean:dev', function() {
  return del(['app/js/goog/**/*']);
});

gulp.task('clean:dist', function() {
  return del(['dist/**/*']);
});

gulp.task('clean', ['clean:dev', 'clean:tmp', 'clean:dist']);

require('require-dir')('./gulp');