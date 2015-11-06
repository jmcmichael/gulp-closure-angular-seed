/**
 *  Compile tasks read app assets (scripts, styles, partials), run them through
 *  various compilers (Closure for Javascript, SCSS for CSS, and templateCache prep for partials)
 *  and copy them to /.tmp/app, where they may then be served by the 'serve' task, or prepared for
 *  distribution by the 'build' task.
 **/

// just copy app JS to /.tmp w/o compilation for development serving
// used by serve task
gulp.task('prep:scripts', function(cb) {
  cb();
});

// compiles SASS styles to CSS, writes to /.tmp/app for serving or prep for build
gulp.task('prep:styles', function(cb) {
  cb();
});

// identifies bower library dependencies, injects links into index.html,
// drops into /.tmp
gulp.task('prep:wiredep', function() {
  gulp.src(root + '/app/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest(root + '/.tmp'));
});