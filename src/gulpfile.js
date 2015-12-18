var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	livereload = require('gulp-livereload');

gulp.task('styles', function() {
	return gulp.src('public/custom_css/*.css')
	.pipe(gulp.dest('public/css'))
	.pipe(rename({suffix:'.min'}))
	.pipe(minifycss())
	.pipe(gulp.dest('public/css'))
});

gulp.task('default', function() {
	gulp.start('styles');
});