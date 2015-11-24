'use strict';

var gulp = require('gulp'),
  conf = require('./_conf.js').conf,
  path = require('path'),
  debug = require('gulp-debug'),
  inject = require('gulp-inject'),
  order = require('gulp-order'),
  es = require('event-stream'),
  unitServer = require('karma').Server,
  e2eServer = require('gulp-angular-protractor'),
  root = require('app-root-path');

gulp.task('test:unit', function(done) {
  new unitServer({
    configFile: root + '/test/unit/karma.conf.js'
  }, done).start();
});

gulp.task('test:unit:prep', ['dev:prep:app-deps'], function() {
  var googBase = gulp.src([conf.dirs.app + '/goog/base.js'], {base: 'goog/', read:false});
  var appDeps = gulp.src([conf.dirs.app + '/app-deps.js'], {read:false});
  var appFiles = gulp.src([conf.scripts.dev], {read:false});

  var allDeps = es.merge(googBase, appDeps, appFiles)
    .pipe(order([
      '**/*/base.js',
      '**/*/deps.js',
      '**/*/app-deps.js',
      '**/*/app.js'
    ]))
    .pipe(debug({title: 'test:unit:prep allDeps'}));

  return gulp.src(root + '/test/unit/karma.conf.js')
    .pipe(inject(allDeps), {
      starttag: '/* inject:files */ files: [',
      endtag: ']',
      transform: function (filepath, file, i, length) {
        console.log('injecting ' + file);
        return '  "' + filepath + '"' + (i + 1 < length ? ',' : '');
      }
    })
    .pipe(gulp.dest(root + '/test/unit'));
});

gulp.task('test:e2e', ['serve'], function(callback) {
  gulp
    .src([root + '/test/e2e/scenarios.js', root + '/app/states/**/*.scenario.js'])
    .pipe(e2eServer({
      'configFile': root + '/test/e2e/protractor.conf.js',
      'debug': false,
      'autoStartStopServer': true
    }))
    .on('error', function(e) {
      console.log(e);
    })
    .on('end', callback);
});

gulp.task('test', ['test:unit', 'test:e2e']);
