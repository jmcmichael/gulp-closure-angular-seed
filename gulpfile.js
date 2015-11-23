'use strict';

var gulp = require('gulp'),
  fs = require('fs'),
  symlink = require('gulp-symlink'),
  root = require('app-root-path'),
  debug = require('gulp-debug'),
  del = require('del');


// creates a symlink to the closure goog library
gulp.task('prep:goog', function(done) {
  var dest = root + '/node_modules/google-closure-library/closure/goog';
  var path = root + '/app/goog';

  return gulp.src(dest)
    .pipe(debug({title: 'symlink src:'}))
    .pipe(symlink(path, {force:true}));
});

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
