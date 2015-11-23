/** gulp/dev.js
 *  Prep app files for devlopment serving
 *  - compile styl -> css, copy to .tmp
 *  - inject deps into index.html, copy to .tmp
 *  - gulp serve task will serve index.html and css from .tmp, and scripts from /app
 **/
'use strict';
var gulp = require('gulp'),
  conf = require('./_conf.js').conf,
  fs = require('fs'),
  gutil = require('gulp-util'),
  glob = require('globby').sync,
  //stylint = require('gulp-stylint'),
  exec = require('child_process').exec,
  sequence = require('run-sequence'),
  debug = require('gulp-debug'),
  stylus = require('gulp-stylus'),
  wiredep = require('wiredep').stream,
  rename = require('gulp-rename'),
  inject = require('gulp-inject'),
  temp = require('temp').track(),
  filesort = require('gulp-angular-filesort'),
  es = require('event-stream'),
  order = require('gulp-order'),
  root = require('app-root-path');

// prepare index.html file
// - inject bower scripts, styles
// - inject app scripts, styles
// - identifies bower library dependencies, injects CDN links w/ fallback test
gulp.task('dev:inject', function(cb) {
  var googBase = gulp.src([conf.dirs.app + '/goog/base.js'], {base: 'goog/'});
  var appDeps = gulp.src([conf.dirs.app + '/app-deps.js']);
  var cssDeps = gulp.src([conf.dirs.temp + '/**/*.css']).pipe(debug({title: 'cssDeps:'}));
  //var appFiles = gulp.src(conf.scripts.dev, { read: true })
  //  .pipe(filesort());
  var appFiles = gulp.src([conf.dirs.app + '/js/app.js']);

  //var allDeps = es.merge(googBase, appDeps)
  var allDeps = es.merge(googBase, appDeps, appFiles, cssDeps)
    .pipe(order([
      '**/*/base.js',
      '**/*/deps.js',
      '**/*/app-deps.js',
      '**/*/app.js'
    ]));

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
    .pipe(inject(allDeps, { ignorePath: ['app/', '.tmp/'], addRootSlash: false }))
    .pipe(gulp.dest(conf.dirs.app));
});

// prep tasks for dev - now it just copies goog deps for easy access in .tmp
gulp.task('dev:prep', function(cb) {
  sequence('prep:goog', 'dev:prep:app-deps', cb);
});

gulp.task('dev:prep:app-deps', function(done) {
  var googBase = gulp.src([conf.dirs.app + '/goog/base.js'], {base: 'goog/'});
  var devFiles = gulp.src(conf.scripts.dev);
  temp.mkdir('closure-compiler-temp', function(err, tmpPath) {
    if (err) {
      done(err, 'error creating temp directory');
    }
    var depsPath = tmpPath + '/' + conf.depsWriter.fileName;
    var command = conf.depsWriter.exec +
      ' --root_with_prefix="' + conf.dirs.app + '/ ../"' +
      ' --output_file="' + tmpPath + '/app-deps.js"';
    console.info(command);
    exec(command, function(error, stdout, stderr) {
      if (error) {
        console.error('stderr: ' + error);
      } else {
        console.log('stdout: ' + stdout);
      }
      gulp.src(depsPath)
        .pipe(gulp.dest(conf.dirs.app));
      done();
    });
  });
});

// compile styl to css, copy to .tmp
gulp.task('dev:styles', function(cb) {
  return gulp.src(conf.styles)
    //.pipe(stylint({ config: '.stylintrc'}))
    .pipe(stylus({ compress: false }))
    //.pipe(stylint.reporter())
    .pipe(gulp.dest(conf.dirs.temp));
});

gulp.task('dev:calcdeps', function(cb) {

});
