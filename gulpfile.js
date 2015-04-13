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

// Browserify
var bundler = browserify('./src/js/main.js', watchify.args);
bundler.transform('brfs'); // implements node's fs.readFileSync for browserify

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
gulp.task('js', bundle);
gulp.task('copy', copyFiles);
gulp.task('fonts', copyFonts);
gulp.task('vendor', copyVendoredLibs);
gulp.task('build', ['copy', 'less', 'fonts', 'vendor', 'js'], function () { return;});

function bundle() {
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('js/bundle.js'))
      // TODO
      // .pipe(buffer())
      // .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      // .pipe(sourcemaps.write({sourceRoot: 'src/'))
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

gulp.task('watch', ['less', 'copy', 'vendor', 'fonts', 'js'], function () {
  var watched_bundler = watchify(bundler);
  watched_bundler.on('update', bundle); // on any dep update, runs the bundler

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

