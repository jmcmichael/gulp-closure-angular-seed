/** gulp/serve.js
 *  Serve tasks run build and dev tasks and serves up the appropriate
 *  directories, reloading on updates to scripts, styles, and templates
 */

'use strict';

var gulp = require('gulp'),
  conf = require('./_conf.js').conf,
  glob = require('globby').sync,
  log = require('gulp-util').log,
  path = require('path'),
  sequence = require('run-sequence'),
  debug = require('gulp-debug'),
  root = require('app-root-path'),
  server = require('browser-sync');

gulp.task('serve', ['serve:dev']);

gulp.task('serve:dev', ['serve:dev:prep'], function(done) {
  server({
    notify: false,
    directory: false,
    port: 9000,
    server: {
      baseDir: ['app', '.tmp'],
      index: 'index.html',
      routes: {
        '/bower_components': './bower_components'
      }
    }
  });
  //gulp.watch(conf.styles, ['dev:styles']).on('change', server.reload);
  //gulp.watch(conf.templates, ['dev:templates']).on('change', server.reload);
  //gulp.watch(conf.scripts.build, ['clean:dist:js', 'build:prep', 'build:inject'])
  //  .on('change', server.reload);
  done();
});

gulp.task('serve:dev:prep', function(done) {
  sequence('dev:prep', 'dev:styles', 'dev:inject', done);
});

gulp.task('serve:dist', ['build'], function(done) {
  server.init({
    server: {
      baseDir: 'dist/app',
      index: 'index.html'
    }
  });

  //gulp.watch(conf.lib, ['clean:dist:lib', 'build:copydep', 'build:inject'])
  //  .on('change', server.reload);

  //gulp.watch(conf.index, ['build:inject'])
  //  .on('change', server.reload);
  //
  //gulp.watch(conf.styles, ['clean:dist:styles', 'build:styles', 'build:inject'])
  //  .on('change', server.reload);
  //
  //gulp.watch(conf.templates, ['clean:dist:js', 'build:templates', 'build:inject'])
  //  .on('change', server.reload);
  //
  //gulp.watch(conf.scripts.build, ['clean:dist:js', 'build:prep', 'build:inject'])
  //  .on('change', server.reload);

  done();
});

