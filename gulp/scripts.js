'use strict';

var gulp = require('gulp'),
  paths = gulp.paths,
  $ = require('gulp-load-plugins')();

gulp.task('scripts', function () {
  return gulp.src(paths.src + '/{app,components}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.babel())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest(paths.tmp + '/babel'))
    .pipe($.size());
});

gulp.task('browserify', ['scripts'], function () {
  return gulp.src(paths.tmp + '/babel/app/index.js')
    .pipe($.browserify())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest(paths.tmp + '/serve/app'))
    .pipe($.size());
});

