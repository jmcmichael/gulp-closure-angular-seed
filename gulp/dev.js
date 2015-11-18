/**
 *  Prep app files for devlopment serving
 *  - compile styl -> css, copy to .tmp
 *  - inject deps into index.html, copy to .tmp
 *  - gulp serve task will serve index.html and css from .tmp, and scripts from /app
 **/

var gulp = require('gulp'),
  conf = require('./_conf.js').conf,
  fs = require('fs'),
  gutil = require('gulp-util'),
  glob = require('globby').sync,
  exec = require('child_process').exec,
  symlink = require('gulp-symlink'),
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
gulp.task('dev:inject', ['dev:styles', 'dev:prep'], function(cb) {
  var googBase = gulp.src([conf.dirs.app + '/goog/base.js'], {base: 'goog/'});
  var appDeps = gulp.src([conf.dirs.app + '/app-deps.js']);
  //var appFiles = gulp.src(conf.scripts.dev, { read: true })
  //  .pipe(filesort());
  var appFiles = gulp.src([conf.dirs.app + '/js/app.js']);

  var allDeps = es.merge(googBase, appDeps, appFiles)
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

    .pipe(inject(allDeps, { ignorePath:['app/'], addRootSlash: false }))
    .pipe(gulp.dest(conf.dirs.app));
});

// prep tasks for dev - now it just copies goog deps for easy access in .tmp
gulp.task('dev:prep', function(cb) {
  sequence('prep:goog', 'prep:app-deps', cb);
});

// creates a symlink to the closure goog library
gulp.task('prep:goog', function(cb) {
  var dest = root + '/node_modules/google-closure-library/closure/goog',
    path = root + '/app/goog';
  fs.symlink(dest, path, function(err) {
    if(err && err.code === 'EEXIST') {
      cb();
    } else if (err) {
      process.exit('goog symlink error: ' + err.code);
    }
  });
  // TODO: handle errors
});

gulp.task('prep:app-deps', function(done) {
  var googBase = gulp.src([conf.dirs.app + '/goog/base.js'], {base: 'goog/'});
  var devFiles = gulp.src(conf.scripts.dev);
  temp.mkdir('closure-compiler-temp', function(err, tmpPath){
    if (err) {
      done(err, 'error creating temp directory');
    }
    var depsPath = tmpPath + '/' + conf.depsWriter.fileName;
    var command = conf.depsWriter.exec +
      ' --root_with_prefix="' + conf.dirs.app + '/ ../"' +
      ' --output_file="' + tmpPath + '/app-deps.js"';
    log.info(command);
    exec(command, function(error, stdout, stderr) {
      if(error) {
        console.error('stderr: '+ error);
      } else {
        console.log('stdout: '+ stdout);
      }
      gulp.src(depsPath)
        .pipe(gulp.dest(conf.dirs.app));
      done();
      //var compiledFile = new gutil.File({
      //  base: tmpPath,
      //  contents: stdout,
      //  cwd: tmpPath,
      //  path: depsPath
      //});
      //console.log('stdout: ' + stdout);
      //console.log('stderr: ' + stderr);
      //done();
    })
  });
});

// compile styl to css, copy to .tmp
gulp.task('dev:styles', function(cb) {
  return gulp.src(conf.styles)
    .pipe(stylus({ compress: false }))
    .pipe(gulp.dest(conf.dirs.temp));
});

gulp.task('dev:calcdeps', function(cb) {

});
