/**
 *  Build tasks take compiled assets, prepared by various compile tasks, and
 *  do any final preparatory/packaging work necessary for production, copying the
 *  final results to /dist
 */

'use strict';
var gulp = require('gulp'),
  conf = require('./gulp-conf.js').conf,
  root = require('app-root-path'),
  glob = require('globby').sync,
  debug = require('gulp-debug'),
  libs = require('main-bower-files'),
  sequence = require('run-sequence'),
  wiredep = require('wiredep').stream,
  inject = require('gulp-inject'),
  cdnizer = require('gulp-cdnizer'),
  rev = require('gulp-rev'),
  compiler = require('gulp-plovrator');


gulp.task('build', function(cb) {
  sequence('clean:dist', ['build:scripts', 'build:styles', 'build:copydep'], 'build:inject', cb);
});

// runs scripts through Closure compiler, produces fingerprinted, minified ES5 js
// and sourcemap, injects links into index.html and copies the results to /dist
gulp.task('build:scripts', function() {
  var scripts = conf.goog.concat(conf.scripts);

  return gulp.src(scripts)
    .pipe(debug({title: 'pre-compile:'}))
    .pipe(compiler({
      compilerPath: 'node_modules/closurecompiler/compiler/compiler.jar',
      fileName: 'app.min.js',
      createSourceMap: true,
      fingerprint: true,
      continueWithWarnings: true,
      compilerFlags: {
        closure_entry_point: 'app',
        debug: false,
        summary_detail_level: 3,
        angular_pass: true,
        //formatting: 'PRETTY_PRINT',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        externs: glob(conf.externs),
        only_closure_dependencies: true,
        export_local_property_definitions: true,
        generate_exports: true,
        // .call is super important, otherwise Closure Library will not work in strict mode.
        output_wrapper: '(function(){%output%}).call(window);',
        warning_level: 'DEFAULT'
      }
    }))
    .pipe(debug({title: 'post-compile/rev:'}))
    .pipe(gulp.dest(conf.dirs.dist + '/app/js'));
});

// concatenates, compiles, fingerprints, and injects link into index.html
gulp.task('build:styles', function(cb) {
  cb();
});

gulp.task('build:copydep', function() {
  return gulp.src(libs({ dest: 'lib' }), { base: 'bower_components' })
    .pipe(debug({title: 'libs: ', minimal: false}))
    .pipe(gulp.dest('dist/app/lib'));
});

// identifies bower library dependencies, injects CDN links w/ fallback test
gulp.task('build:inject', ['build:copydep'], function(cb) {
  return gulp.src('app/index.html')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: [],
      ignorePath: '../bower_components/',
      fileTypes: {
        html: {
          replace: {
            js: '<script src="lib/{{filePath}}"></script>',
            css: '<link rel="stylesheet" href="lib/{{filePath}}" />'
          }
        }
      }
    }))
    .pipe(cdnizer({
      allowRev: true,
      allowMin: true,
      relativeRoot: 'app/',
      files: [
        {
          file: '**/*/angular.js',
          package: 'angular',
          test: 'window.angular',
          cdn: '//ajax.googleapis.com/ajax/libs/angularjs/${ version }/angular.min.js'
        },
        {
          file: '**/*/angular-ui-router.js',
          package: 'angular-ui-router',
          test: 'window.angular.module("ui.router")',
          cdn: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/${ version }/angular-ui-router.min.js/'
        }
      ]
    }))
    .pipe(inject(gulp.src([conf.dirs.dist + '/app/js/**/*.js',conf.dirs.dist + '/app/css/**/*.css' ],{ read: false, cwd: 'dist/app/' }),
      { relative: false, addRootSlash: false }
    ))
    .pipe(gulp.dest(conf.dirs.dist + '/app'));
});