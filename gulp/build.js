'use strict';
var gulp = require('gulp'),
//exec = require('gulp-exec'),
  exec = require('child_process').exec;

var conf = {
  // app
  app: 'app/js/app.js',

  // get all states / modules
  states: [
    'app/states/**/*.js',
    '!app/states/**/*.pageobject.js',
    '!app/states/**/*.scenario.js',
    '!app/states/**/*.spec.js'
  ].join(' '),

  // get all components
  components: [
    'app/components/**/*.js',
    '!app/components/**/*.spec.js'
  ].join(' '),

};

gulp.task('compile', function() {
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
      // '--formatting PRETTY_PRINT ' +
    '--language_in ECMASCRIPT5_STRICT ' +
    '--angular_pass ' +                                // inject dependencies automatically
    '--externs closure/externs/angular.js ' +          // angular.d -> angular.module
    '--generate_exports ' +                            // keep @export notated code
    '--manage_closure_dependencies ' +
    '--js closure/library/base.js ' +                  // don't add 'goog.' stuff to script
    '--js ' + conf.app +
    '--js ' + conf.states +
    '--js ' + conf.components +
    '--js_output_file app/js/app.min.js', options);
});