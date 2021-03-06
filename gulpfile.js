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
  var appPath = root + '/app/goog';
  var tempPath = conf.dirs.temp + '/goog';

  return gulp.src(dest)
    .pipe(debug({title: 'symlink src:'}))
    .pipe(symlink(appPath, {force:true}))
    .pipe(symlink(tempPath, {force:true}));
});

// copies vendor scripts and styles to dist/lib
gulp.task('prep:copylibs', function() {
  return gulp.src(libs({ dest: 'lib' }), { base: 'bower_components' })
    .pipe(gulp.dest(conf.dirs.dist + '/app/lib'));
});

// copies vendor scripts and styles to .tmp
gulp.task('dev:prep:copylibs', function() {
  return gulp.src('app/libs/**/*.js', { base: 'app/libs' })
    .pipe(debug({title:'dev:prep:copylibs:'}))
    .pipe(gulp.dest(conf.dirs.temp + '/libs'));
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
