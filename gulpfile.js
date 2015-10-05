var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

gulp.task('css', function() {
	gulp.src('./scss/series.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['> 2%'],
			cascade: false
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist', {mode: 0644}));
});

gulp.task('js', function() {
	gulp.src('./js/*.js')
		.pipe(babel())
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist', {mode: 0644}));
});

gulp.task('default', ['build']);
gulp.task('build', ['css', 'js']);