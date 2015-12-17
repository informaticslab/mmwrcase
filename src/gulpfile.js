var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload');

gulp.task('styles', function() {
	return sass('public/scss/*.scss', {style:'expanded'})
	.pipe(autoprefixer('last 2 versions'))
	.pipe(gulp.dest('public/css'))
	.pipe(rename({suffix:'.min'}))
	.pipe(minifycss())
	.pipe(gulp.dest('public/css'))
	.pipe(notify({message: 'Styles task complete'}));
});