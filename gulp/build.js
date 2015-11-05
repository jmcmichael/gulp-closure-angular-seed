'use strict';
var gulp = require('gulp'),
  glob = require('globby').sync,
  debug = require('gulp-debug'),
  compiler = require('gulp-closure-compiler');

gulp.task('build:js', function() {
  return gulp.src([
      'closure/library/**/*.js',
      'app/js/app.js',
      'app/states/**/*.js',
      'app/components/**/*.js',
      '!**/*.pageobject.js',
      '!**/*.scenario.js',
      '!**/*.spec.js'
    ])
    .pipe(debug({title: 'pre-compile:'}))
    .pipe(compiler({
      compilerPath: 'closure/compiler.jar',
      fileName: 'app.min.js',
      continueWithWarnings: true,
      compilerFlags: {
        closure_entry_point: 'app',
        debug: true,
        summary_detail_level: 3,
        angular_pass: true,
        formatting: 'PRETTY_PRINT',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        //define: [
        //  "goog.DEBUG=false"
        //],
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
    .pipe(gulp.dest('app/js'));
});

gulp.task('build', ['build:js']);