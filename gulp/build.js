'use strict';
var gulp = require('gulp'),
  closure = require('closure-compiler-stream'),
  sourcemaps = require('gulp-sourcemaps');

// Basic compile
gulp.task('closure', function () {
  return gulp.src('path/to/js/*.js')
    .pipe(closure())
    .pipe(gulp.dest('path/to/minified/js/'));
});

// With sourcemaps
gulp.task('closure:sourcemap', function () {
  return gulp.src('path/to/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(closure())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('path/to/minified/js/'));
});