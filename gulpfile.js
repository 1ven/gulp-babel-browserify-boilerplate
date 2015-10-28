var gulp = require('gulp'),
	connect = require('gulp-connect'),
	del = require('del'),
	babel = require('gulp-babel')
	rename = require('gulp-rename');

gulp.task('clean', function(cb) {
	del('build', cb);
});

gulp.task('connect', function() {
	connect.server({
		root: 'build',
		port: '1337',
		livereload: true
	});
});

gulp.task('babel', function() {
	gulp.src('source/index.js')
		.pipe(babel())
		.pipe(rename({
			basename: 'script'
		}))
		.pipe(gulp.dest('build/js'))
		.pipe(connect.reload());
});

gulp.task('copy', function() {
	gulp.src('source/html/*.html')
		.pipe(gulp.dest('build/'))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch('source/*.js', ['babel']);
	gulp.watch('source/html/*.html', ['copy']);
});

gulp.task('default', ['clean'], function() {
	gulp.start('connect', 'copy', 'babel', 'watch');
});
