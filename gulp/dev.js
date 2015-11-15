/**
 *  Prep app files for devlopment serving
 *  - compile styl -> css, copy to .tmp
 *  - inject deps into index.html, copy to .tmp
 *  - gulp serve task will serve index.html and css from .tmp, and scripts from /app
 **/

var gulp = require('gulp'),
  conf = require('./gulp-conf.js').conf,
  glob = require('globby').sync,
  debug = require('gulp-debug'),
  stylus = require('gulp-stylus'),
  wiredep = require('wiredep').stream,
  inject = require('gulp-inject');

// prepare index.html file
// - inject bower scripts, styles
// - inject app scripts, styles
// - identifies bower library dependencies, injects CDN links w/ fallback test
gulp.task('dev:inject', ['dev:styles'], function(cb) {
  var scripts = conf.goog.concat(conf.scripts);
  return gulp.src('app/index.html')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: [],
      ignorePath: '../bower_components/',
      fileTypes: {
        html: {
          replace: {
            js: '<script src="{{filePath}}"></script>',
            css: '<link rel="stylesheet" href="{{filePath}}" />'
          }
        }
      }
    }))
    .pipe(inject(gulp.src(scripts.concat(['.tmp/**/*.css'])),
      { relative: false, addRootSlash: false }
    ))
    .pipe(gulp.dest(conf.dirs.temp));
});

// compile styl to css, copy to .tmp
gulp.task('dev:styles', function(cb) {
  return gulp.src(conf.styles)
    .pipe(stylus({ compress: false }))
    .pipe(gulp.dest(conf.dirs.temp));
});
