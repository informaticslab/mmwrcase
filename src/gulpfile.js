var gulp = require('gulp'),
	gutil = require('gulp-util'),
	sass = require('gulp-ruby-sass'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	livereload = require('gulp-livereload');

gulp.task('styles', function() {
	return gutil.log('Gulp is running!');
});