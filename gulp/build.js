/**
 *  Build tasks take compiled assets, prepared by various compile tasks, and
 *  do any final preparatory/packaging work necessary for production, copying the
 *  final results to /dist
 */

'use strict';
var gulp = require('gulp'),
  _ = require('lodash'),
  conf = require('./gulp-conf.js').conf,
  root = require('app-root-path'),
  rev = require('gulp-rev'),
  glob = require('globby').sync,
  debug = require('gulp-debug'),
  libs = require('main-bower-files'),
  sequence = require('run-sequence'),
  wiredep = require('wiredep').stream,
  inject = require('gulp-inject'),
  cdnizer = require('gulp-cdnizer'),
  concat = require('gulp-concat'),
  compiler = require('gulp-plovrator'),
  stylus = require('gulp-stylus'),
  templateCache = require('gulp-angular-templatecache'),
  sourcemaps = require('gulp-sourcemaps');

var closureConf = {
  default: {
    compilerPath: 'node_modules/closurecompiler/compiler/compiler.jar',
    fileName: 'app.min.js',
    createSourceMap: false,
    fingerprint: true,
    continueWithWarnings: true,
    compilerFlags: {
      closure_entry_point: 'app',
      debug: false,
      summary_detail_level: 3,
      angular_pass: true,
      compilation_level: 'ADVANCED_OPTIMIZATIONS',
      externs: glob(conf.externs),
      only_closure_dependencies: true,
      export_local_property_definitions: true,
      generate_exports: true,
      // .call is super important, otherwise Closure Library will not work in strict mode.
      output_wrapper: '(function(){%output%}).call(window);',
      warning_level: 'DEFAULT'
    }
  },
  debug: {
    compilerPath: 'node_modules/closurecompiler/compiler/compiler.jar',
    fileName: 'app.min.js',
    createSourceMap: true,
    fingerprint: true,
    continueWithWarnings: true,
    compilerFlags: {
      closure_entry_point: 'app',
      debug: true,
      summary_detail_level: 3,
      angular_pass: true,
      formatting: 'PRETTY_PRINT',
      compilation_level: 'ADVANCED_OPTIMIZATIONS',
      externs: glob(conf.externs),
      only_closure_dependencies: true,
      export_local_property_definitions: true,
      generate_exports: true,
      // .call is super important, otherwise Closure Library will not work in strict mode.
      output_wrapper: '(function(){%output%}).call(window);',
      warning_level: 'DEFAULT'
    }
  }
};


gulp.task('build', function(cb) {
  sequence('clean:dist', ['build:scripts', 'build:templates', 'build:styles', 'build:copydep'], 'build:inject', cb);
});

gulp.task('build:debug', function(cb) {
  sequence('clean:dist', ['build:debug:scripts', 'build:templates', 'build:styles', 'build:copydep'], 'build:inject', cb);
});

// runs scripts through Closure compiler, produces fingerprinted, minified ES5 js
// and sourcemap, injects links into index.html and copies the results to /dist
gulp.task('build:scripts', function() {
  var scripts = conf.goog.concat(conf.scripts);

  return gulp.src(scripts)
    .pipe(compiler(closureConf.default))
    .pipe(gulp.dest(conf.dirs.dist + '/app/js'));
});

// debug script compile, toggles closure's debug mode and pretty-print
gulp.task('build:debug:scripts', function() {
  var scripts = conf.goog.concat(conf.scripts);

  return gulp.src(scripts)
    .pipe(compiler(closureConf.debug))
    .pipe(gulp.dest(conf.dirs.dist + '/app/js'));
});

// concatenates and compiles .styl files with sourcemap
gulp.task('build:styles', function() {
  return gulp.src(conf.styles)
    .pipe(concat('app.css'))
    .pipe(sourcemaps.init())
    .pipe(stylus({ compress: true }))
    .pipe(rev())
    .pipe(sourcemaps.write('.', {
      sourceMappingURL: function(file) {
        return file.relative + '.map';
      }
    }))
    .pipe(gulp.dest(conf.dirs.dist + '/app/styles'));
});

// copies vendor scripts and styles to dist/lib
gulp.task('build:copydep', function() {
  return gulp.src(libs({ dest: 'lib' }), { base: 'bower_components' })
    .pipe(gulp.dest(conf.dirs.dist + '/app/lib'));
});

//collects all angular templates (*.tpl.html), creates templateCache module script for later injection
gulp.task('build:templates', function() {
  return gulp.src(conf.templates)
    .pipe(debug({ title: 'templates: '}))
    .pipe(templateCache('templates.js', { standalone: true }))
    .pipe(rev())
    .pipe(gulp.dest(conf.dirs.dist + '/app/js'));
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
          cdn: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/${ version }/angular-ui-router.min.js'
        }
      ]
    }))
    .pipe(inject(gulp.src([conf.dirs.dist + '/app/js/**/*.js',conf.dirs.dist + '/app/styles/**/*.css' ],{ read: false, cwd: 'dist/app/' }),
      { relative: false, addRootSlash: false }
    ))
    .pipe(gulp.dest(conf.dirs.dist + '/app'));
});