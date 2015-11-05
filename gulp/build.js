'use strict';
var gulp = require('gulp'),
  glob = require('globby').sync,
  debug = require('gulp-debug'),
  wiredep = require('wiredep').stream,
  root = require('app-root-path'),
  compiler = require('gulp-closure-compiler');

gulp.task('wiredep', function() {
  gulp.src(root + '/app/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest(root + '/.tmp/app'));
});

gulp.task('build:js', function() {
  var clientScripts = [
    'closure/library/**/*.js',
    'app/js/app.js',
    'app/states/**/*.js',
    'app/components/**/*.js',
    '!**/*.pageobject.js',
    '!**/*.scenario.js',
    '!**/*.spec.js'
  ];

  return gulp.src(clientScripts)
    .pipe(debug({title: 'pre-compile:'}))
    .pipe(compiler({
      compilerPath: 'closure/compiler.jar',
      fileName: 'app.min.js',
      continueWithWarnings: true,
      compilerFlags: {
        closure_entry_point: 'app',
        debug: false,
        summary_detail_level: 3,
        angular_pass: true,
        formatting: 'PRETTY_PRINT',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        externs: glob('closure/externs/*.js'),
        only_closure_dependencies: true,
        export_local_property_definitions: true,
        generate_exports: true,
        // .call is super important, otherwise Closure Library will not work in strict mode.
        output_wrapper: '(function(){%output%}).call(window);',
        warning_level: 'DEFAULT',
        create_source_map: 'app/js/%outname%.map'
      }
    }))
    .pipe(debug({title: 'post-compile:'}))
    .pipe(gulp.dest(root + '/.tmp/app/js'));
});

gulp.task('build', ['wiredep', 'build:js']);