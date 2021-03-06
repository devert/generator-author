'use strict';

var path = require('path');
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');
var plumber = require('gulp-plumber');

gulp.task('test', function (cb) {
  var mochaErr;

  gulp.src([
    'test/*.js',
    'app/index.js',
    'subgenerator/index.js',
    'gulpfile.js'
  ])
  .pipe(istanbul({
    includeUntested: true
  }))
  .pipe(istanbul.hookRequire())
  .on('finish', function () {
    gulp.src(['test/*.js'])
      .pipe(plumber())
      .pipe(mocha({
        reporter: 'spec'
      }))
      .on('error', function (err) {
        mochaErr = err;
      })
      .pipe(istanbul.writeReports())
      .on('end', function () {
        cb(mochaErr);
      });
  });
});

gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return false;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
      .pipe(coveralls());
});

gulp.task('default', ['test', 'coveralls']);