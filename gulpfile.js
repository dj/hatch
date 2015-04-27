var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat-sourcemap');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var watch = require('gulp-watch');
var less = require('gulp-less');
var path = require('path');

// Asset locations
var not_tests = '!src/test/**';
var html_files = 'src/**/*.html';
var pngs = 'src/**/*.png'
var files = [
  not_tests,
  html_files,
  pngs
]
var libs = 'src/js/vendor/**/*';
var fonts = 'src/fonts/**/*';
var less_files = './src/less/**/*.less';

// Tasks
gulp.task('default', ['watch']);
gulp.task('copy', copyFiles);
gulp.task('fonts', copyFonts);
gulp.task('vendor', copyVendoredLibs);
gulp.task('build', ['copy', 'less', 'fonts', 'vendor', 'browserify'], function () { return;});
gulp.task('browserify', function(){
  var watch = false;

  bundle({ watch: false });
});
gulp.task('browserify-watch', function(){
  watch = true;
  bundle({ watch: true });
});

function bundle(opts) {
  var bundler = browserify('./src/js/main.js', watchify.args);
  bundler.transform('brfs'); // implements node's fs.readFileSync for browserify

  if (opts.watch) {
    var bundler = watchify(bundler)

    bundler.on('update', function(b) {
      bundleShare(bundler)
    })
  }

  return bundleShare(bundler);
}

function bundleShare(b) {
  b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('js/bundle.js'))
    .pipe(gulp.dest('./build'));
}

gulp.task('less', function() {
  return gulp.src(less_files)
    .pipe(less({
      paths: [
        'node_modules/bootstrap/less'
      ]
    }))
    .pipe(gulp.dest('./build/css'));
})

gulp.task('watch', ['less', 'copy', 'vendor', 'fonts', 'browserify-watch'], function () {
  gulp.watch(less_files, ['less']);
  gulp.watch(files, ['copy']);
  gulp.watch(libs, ['vendor']);
  gulp.watch(fonts, ['fonts']);
});

function copyFiles() {
  gulp.src(files)
    .pipe(gulp.dest('build'));
}

function copyVendoredLibs() {
  gulp.src(libs)
    .pipe(gulp.dest('build/js/vendor'));
}

function copyFonts() {
  gulp.src(fonts)
    .pipe(gulp.dest('build/fonts'));
}

