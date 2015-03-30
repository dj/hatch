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

// Browserify
var bundler = watchify(browserify('./src/js/main.js', watchify.args));
bundler.transform('brfs'); // implements node's fs.readFileSync for browserify

// Tasks
gulp.task('default', ['copy', 'less', 'vendor', 'js']);
gulp.task('copy', copyFiles);
gulp.task('js', bundle); // so you can run `gulp js` to build the file
gulp.task('vendor', copyVendoredLibs);
bundler.on('update', bundle); // on any dep update, runs the bundler

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

gulp.task('less', function () {
  return gulp.src('src/less/custom-bootstrap.less')
    .pipe(less({
      paths: [ 'node_modules/bootstrap/less' ]
    }))
    .pipe(gulp.dest('./build/css'));
});

function copyFiles() {
  var files = [
    'src/**/*.html',
    'src/**/*.png'
  ]

  gulp.src(files)
    .pipe(watch(files))
    .pipe(gulp.dest('build'));
}

function copyVendoredLibs() {
  var libs = 'src/js/vendor/**/*';

  gulp.src(libs)
    .pipe(watch(libs))
    .pipe(gulp.dest('build/js/vendor'));
}

