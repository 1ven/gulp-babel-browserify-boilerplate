var gulp = require('gulp'),
	connect = require('gulp-connect'),
	del = require('del'),
	uglify = require('gulp-uglify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	watchify = require('watchify'),
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

gulp.task('copy', function() {
	gulp.src('source/html/*.html')
		.pipe(gulp.dest('build/'))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch('source/*.js', ['babel']);
	gulp.watch('source/html/*.html', ['copy']);
});

gulp.task('browserify', function() {
	var bundler = browserify({
			entries: ['source/index.js'],
			transform: [
				babelify.configure({
					plugins: ["jsx-control-statements/babel"]
				})
			],
			debug: true,
			cache: {},
			packageCache: {},
			fullPaths: true
		})

	var watcher = watchify(bundler);

	return watcher
		.on('update', function() {
			var updateStart = Date.now();
			console.log('Updating!');
			watcher
				.bundle()
				.pipe(source('client.min.js'))
				.pipe(buffer())
				// .pipe(uglify())
				.pipe(gulp.dest('build'));
			console.log('Updated!', (Date.now() - updateStart) + 'ms');
		})
		.bundle()
		.pipe(source('client.min.js'))
		.pipe(buffer())
		// .pipe(uglify())
		.pipe(gulp.dest('build'));
});

gulp.task('default', ['clean'], function() {
	gulp.start('connect', 'copy', 'browserify', 'watch');
});
