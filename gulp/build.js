'use strict';
var gulp = require('gulp'),
  glob = require('globby').sync,
  exec = require('child_process').exec,
  path = require('path'),
  plovr = require('gulp-plovr');

var conf = {
  // app
  app: 'app/js/app.js',

  // get all states / modules
  states: glob([
    'app/states/**/*.js',
    '!app/states/**/*.pageobject.js',
    '!app/states/**/*.scenario.js',
    '!app/states/**/*.spec.js'
  ]).join(' '),

  // get all components
  components: glob([
    'app/components/**/*.js',
    '!app/components/**/*.spec.js'
  ]).join(' ')

};

console.log(conf.states + '\n');
console.log(conf.components + '\n');

gulp.task('build', function() {
  var opts = {
    plovr_path: path.join(__dirname, '../plovr/plovr-1d46538a.jar'),
    debug: true
  };

  return gulp.src(['plovr/config-build.json'])
    .pipe(plovr(opts));
});

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
    '--formatting PRETTY_PRINT ' +
    '--language_in ECMASCRIPT5_STRICT ' +
    '--angular_pass ' +                                // inject dependencies automatically
    '--externs closure/externs/angular.js ' +          // angular.d -> angular.module
    '--generate_exports ' +                            // keep @export notated code
    '--manage_closure_dependencies ' +
    '--js closure/library/base.js ' +                  // don't add 'goog.' stuff to script
    '--js ' + conf.app + ' ' +
    '--js ' + conf.states + ' ' +
    '--js ' + conf.components + ' ' +
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