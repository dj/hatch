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
gulp.task('default', ['copy', 'less', 'js']);
gulp.task('copy', copy);
gulp.task('js', bundle); // so you can run `gulp js` to build the file
bundler.on('update', bundle); // on any dep update, runs the bundler
gulp.task('build', ['less', 'js'], build);

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

function copy() {
  gulp.src(['src/**/*.html', 'src/i**/*.png', 'src/**/*.less' ])
    .pipe(watch(['src/**/*.html', 'src/**/*.less', 'src/**/*.png']))
    .pipe(gulp.dest('build'));
}

function build() {
  gulp.src(['src/**/*.html', 'src/i**/*.png', 'src/**/*.less' ])
    .pipe(gulp.dest('build'))
    .once('end', function () {
      process.exit();
    });
}

