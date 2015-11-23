/** gulp/build.js
 *  Build tasks take compiled assets, prepared by various compile tasks, and
 *  do any final preparatory/packaging work necessary for production, copying the
 *  final results to /dist
 */

'use strict';
var gulp = require('gulp'),
  _ = require('lodash'),
  conf = require('./_conf.js').conf,
  root = require('app-root-path'),
  rev = require('gulp-rev'),
  glob = require('globby').sync,
  debug = require('gulp-debug'),
  libs = require('main-bower-files'),
  sequence = require('run-sequence'),
  es = require('event-stream'),
  wiredep = require('wiredep').stream,
  inject = require('gulp-inject'),
  cdnizer = require('gulp-cdnizer'),
  concat = require('gulp-concat'),
  compiler = require('gulp-plovrator'),
  stylus = require('gulp-stylus'),
  insert = require('gulp-insert'),
  rename = require('gulp-rename'),
  templateCache = require('gulp-angular-templatecache'),
  sourcemaps = require('gulp-sourcemaps'),
  htmlmin = require('gulp-htmlmin'),
  server = require('browser-sync').create();

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
  sequence(
    'clean:dist',
    'build:prep',
    'build:templates',
    [
      'build:scripts',
      'build:styles',
      'build:copydep'
    ],
    'build:inject',
    cb);
});

gulp.task('build:debug', function(cb) {
  sequence(
    'clean:dist',
    'build:prep',
    [
      'build:debug:scripts',
      'build:templates',
      'build:styles',
      'build:copydep'
    ],
    'build:inject',
    cb);
});

// runs scripts through Closure compiler, produces fingerprinted, minified ES5 js
// and sourcemap, injects links into index.html and copies the results to /dist
gulp.task('build:scripts', function() {
  var googSrc = gulp.src(conf.goog);
  var appSrc = gulp.src(conf.scripts.build);

  return es.merge(googSrc, appSrc)
    .pipe(debug({title: 'build:scripts - pre compile'}))
    .pipe(compiler(closureConf.default))
    .pipe(debug({title: 'build:scripts- post compile'}))
    .pipe(gulp.dest(conf.dirs.dist + '/app/js'))
    .pipe(server.stream());
});

// debug script compile, toggles closure's debug mode and pretty-print
gulp.task('build:debug:scripts', function() {
  var scripts = conf.goog.concat(conf.scripts.build);

  return gulp.src(scripts)
    .pipe(debug({title: 'build:debug:scripts - pre compile'}))
    .pipe(compiler(closureConf.debug))
    .pipe(debug({title: 'build:debug:scripts - post compile'}))
    .pipe(gulp.dest(conf.dirs.dist + '/app/js'))
    .pipe(server.stream());
});

// concatenates and compiles .styl files with sourcemap
gulp.task('build:styles', ['clean:dist:styles'], function() {
  return gulp.src(conf.styles)
    .pipe(debug({title: 'pre-styl: '}))
    .pipe(concat('app.css'))
    .pipe(sourcemaps.init())
    .pipe(stylus({ compress: true }))
    .pipe(rev())
    .pipe(sourcemaps.write('.', {
      sourceMappingURL: function(file) {
        return file.relative + '.map';
      }
    }))
    .pipe(gulp.dest(conf.dirs.dist + '/app/styles'))
    .pipe(server.stream());
});

// copies vendor scripts and styles to dist/lib
gulp.task('build:copydep', function() {
  return gulp.src(libs({ dest: 'lib' }), { base: 'bower_components' })
    .pipe(gulp.dest(conf.dirs.dist + '/app/lib'));
});

// collects all angular templates (*.tpl.html), creates templateCache module script
// for later injection
gulp.task('build:templates', function() {
  return gulp.src(conf.templates)
    .pipe(debug({ title: 'templates: '}))
    .pipe(templateCache('templates.js', { standalone: true }))
    .pipe(insert.prepend('"use strict"; goog.provide("my.templates"); my.templates = '))
    .pipe(gulp.dest(conf.dirs.temp + '/templateCache'));
});

// performs any prep work necessary for build success
gulp.task('build:prep', function(done) {
  sequence('prep:goog', done);
});

// identifies bower library dependencies, injects CDN links w/ fallback test
gulp.task('build:inject', ['build:copydep'], function(cb) {
  var scriptSrc = gulp.src(conf.dirs.dist + '/app/js/**/*.js', {read: false, cwd: 'dist/app'});
  var stylesSrc = gulp.src(conf.dirs.dist + '/app/styles/**/*.css', {read: false, cwd: 'dist/app'});

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
          cdn: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/' +
          '${ version }/angular-ui-router.min.js'
        }
      ]
    }))
    .pipe(inject(es.merge(scriptSrc, stylesSrc), { relative: false, addRootSlash: false }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      preserveLineBreaks: true,
      removeComments: true
    }))
    .pipe(gulp.dest(conf.dirs.dist + '/app'))
    .pipe(server.stream());
});
