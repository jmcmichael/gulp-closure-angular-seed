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
      baseDir: ['.tmp'],
      index: 'index.html',
      routes: {
        '/bower_components': './bower_components'
      }
    },
    socket: {
      domain: "localhost:3000"
    }
  });
  gulp.watch(conf.styles, ['dev:styles']).on('change', server.reload);
  gulp.watch(conf.templates, ['dev:prep:templates']).on('change', server.reload);
  gulp.watch(conf.scripts.build, ['dev:prep:transpile', 'dev:prep:app-deps', 'dev:inject']).on('change', server.reload);
  done();
});

gulp.task('serve:dev:prep', function(done) {
  sequence('dev:prep', 'dev:styles', 'dev:inject', done);
});

gulp.task('serve:dist', ['build'], function(done) {
  server.init({
    server: {
      notify: false,
      directory: false,
      baseDir: 'dist/app',
      index: 'index.html'
    },
    socket: {
      domain: 'localhost:3000'
    }
  });

  gulp.watch(conf.styles, ['build:styles', 'build:inject']).on('change', server.reload);
  gulp.watch(conf.templates, ['build']).on('change', server.reload);
  gulp.watch(conf.scripts.build, ['build']).on('change', server.reload);

  done();
});


