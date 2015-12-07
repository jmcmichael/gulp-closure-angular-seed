'use strict';

var gulp = require('gulp'),
  conf = require('./gulp/_conf.js').conf,
  fs = require('fs'),
  symlink = require('gulp-symlink'),
  libs = require('main-bower-files'),
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

// copies vendor scripts and styles to dist/lib
gulp.task('prep:copylibs', function() {
  return gulp.src(libs({ dest: 'lib' }), { base: 'bower_components' })
    .pipe(gulp.dest(conf.dirs.dist + '/app/lib'));
});

// copy onsen deps not included by main-bower-files
gulp.task('prep:copylibs:onsen', function() {
  return gulp.src([
    'bower_components/onsenui/build/css/**/*',
    '!**/onsenui.css',
    '!**/onsen-css-components.css'
  ], { base: 'bower_components' })
    .pipe(gulp.dest(conf.dirs.dist + '/app/lib'));
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
