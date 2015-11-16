/**
 *  Prep app files for devlopment serving
 *  - compile styl -> css, copy to .tmp
 *  - inject deps into index.html, copy to .tmp
 *  - gulp serve task will serve index.html and css from .tmp, and scripts from /app
 **/

var gulp = require('gulp'),
  conf = require('./gulp-conf.js').conf,
  glob = require('globby').sync,
  sequence = require('run-sequence'),
  debug = require('gulp-debug'),
  stylus = require('gulp-stylus'),
  wiredep = require('wiredep').stream,
  rename = require('gulp-rename'),
  inject = require('gulp-inject'),
  filesort = require('gulp-angular-filesort'),
  closureDeps = require('gulp-closure-deps'),
  es = require('event-stream'),
  order = require('gulp-order'),
  root = require('app-root-path');

// prepare index.html file
// - inject bower scripts, styles
// - inject app scripts, styles
// - identifies bower library dependencies, injects CDN links w/ fallback test
gulp.task('dev:inject', ['dev:styles', 'dev:prep'], function(cb) {
  var ngFiles = gulp.src(conf.scripts.dev,{read: true })
    .pipe(filesort());

  var googFiles = gulp.src(conf.dirs.temp + '/goog/*.js')
    .pipe(order(['base.js', 'deps.js', 'app-deps.js']));

  return gulp.src(conf.dirs.app + '/index.html')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: [],
      ignorePath: '../',
      fileTypes: {
        html: {
          replace: {
            js: '<script src="{{filePath}}"></script>',
            css: '<link rel="stylesheet" href="{{filePath}}" />'
          }
        }
      }
    }))
    .pipe(inject(es.merge(googFiles, ngFiles), { ignorePath: ['/app/', '/.tmp/'], addRootSlash: false }))
    .pipe(gulp.dest(conf.dirs.app));
});

// prep tasks for dev - now it just copies goog deps for easy access in .tmp
gulp.task('dev:prep', function(cb) {
  sequence('prep:goog', 'prep:app-deps', cb);
});

gulp.task('prep:goog', function(cb) {
  return gulp.src(conf.goog).pipe(gulp.dest(conf.dirs.temp + '/goog'));
});

gulp.task('prep:app-deps', function(cb) {
  return gulp.src(conf.scripts.dev)
    .pipe(closureDeps({
      fileName: 'app-deps.js',
      prefix: '',
      baseDir: 'app/'
    }))
    .pipe(gulp.dest(conf.dirs.temp + '/goog/'));
});

// compile styl to css, copy to .tmp
gulp.task('dev:styles', function(cb) {
  return gulp.src(conf.styles)
    .pipe(stylus({ compress: false }))
    .pipe(gulp.dest(conf.dirs.temp));
});
