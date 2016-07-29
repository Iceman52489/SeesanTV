import config from '../config';
import gulp from 'gulp';
import install from 'gulp-install';

gulp.task('install', function() {
	return gulp
		.src(config.install)
		.pipe(
			install()
		);
});
