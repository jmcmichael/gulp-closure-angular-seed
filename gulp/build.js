'use strict';
var gulp = require('gulp'),
  glob = require('globby').sync,
  exec = require('child_process').exec,
  path = require('path'),
  debug = require('gulp-debug'),
  filter = require('gulp-filter'),
  compiler = require('gulp-closure-compiler');

var conf = {
  // app
  app: 'app/js/app.js',

  // get all states / modules
  states: glob([
    'app/states/**/*.js',
    '!app/states/**/*.pageobject.js',
    '!app/states/**/*.scenario.js',
    '!app/states/**/*.spec.js'
  ]),

  // get all components
  components: glob([
    'app/components/**/*.js',
    '!app/components/**/*.spec.js'
  ]),

  externs: glob('closure/externs/*.js'),

  // plovr conf
  plovr: 'plovr/plovr-1d46538a.jar',
  source_map: 'app/js'
};

console.log(conf.states + '\n');
console.log(conf.components + '\n');

gulp.task('build', function() {
  return gulp.src([
      'app/js/app.js',
      'app/states/**/*.js',
      'app/components/**/*.js',
      '!**/*.pageobject.js',
      '!**/*.scenario.js',
      '!**/*.spec.js'
    ])
    .pipe(debug({title: 'after filter:'}))
    .pipe(compiler({
      compilerPath: 'closure/compiler.jar',
      fileName: 'app.min.js',
      compilerFlags: {
        closure_entry_point: 'app',
        angular_pass: true,
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        //define: [
        //  "goog.DEBUG=false"
        //],
        externs: conf.externs,
        only_closure_dependencies: true,
        // .call is super important, otherwise Closure Library will not work in strict mode.
        output_wrapper: '(function(){%output%}).call(window);',
        warning_level: 'DEFAULT',
        create_source_map: '%outname%.map'
      }
    }))
    .pipe(gulp.dest('app/js'));
});

gulp.task('build:exec', function() {
  var options = {
    continueOnError: false, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
    customTemplatingThing: "test" // content passed to gutil.template()
  };
  var reportOptions = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true // default = true, false means don't write stdout
  };
  exec('java -jar closure/compiler.jar ' +
    '--compilation_level ADVANCED_OPTIMIZATIONS ' +
    '--formatting PRETTY_PRINT ' +
    '--language_in ECMASCRIPT5_STRICT ' +
    '--angular_pass ' +                                // inject dependencies automatically
    '--externs closure/externs/angular-1.3.js ' +          // angular.d -> angular.module
    '--generate_exports ' +                            // keep @export notated code
    '--manage_closure_dependencies ' +
    '--js closure/library/base.js ' +                  // don't add 'goog.' stuff to script
    '--js ' + conf.app + ' ' +
    '--js ' + conf.states.join(' ') + ' ' +
    '--js ' + conf.components.join(' ') + ' ' +
    '--js_output_file app/js/app.min.js ' +
    '--create_source_map %outname%.map',
    options,
    function(error, stdout, stderr) {
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
      if (error !== null) {
        console.log('exec error: ', error);
      }
    });
});