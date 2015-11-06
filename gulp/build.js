/**
*  Build tasks take compiled assets, prepared by various compile tasks, and
*  do any final preparatory/packaging work necessary for production, copying the
*  final results to /dist
*/

'use strict';
var gulp = require('gulp'),
  glob = require('globby').sync,
  debug = require('gulp-debug'),
  wiredep = require('wiredep').stream,
  compiler = require('gulp-closure-compiler');

// runs scripts through Closure compiler, produces fingerprinted, minified ES5 js
// and sourcemap, injects links into index.html and copies the results to /dist
gulp.task('build:scripts', function() {
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
      compilerPath: 'node_modules/closurecompiler/compiler/compiler.jar',
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

// concatenates, compiles, fingerprints, and injects link into index.html
gulp.task('build:styles', function(cb) {
  cb();
});

// identifies bower library dependencies, injects links into index.html
// then replaces relevant library links with references to CDN versions
gulp.task('build:wiredep', function() {

});

gulp.task('build', ['build:styles', 'build:scripts', 'build:wiredep']);