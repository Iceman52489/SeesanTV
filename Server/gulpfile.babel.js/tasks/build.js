import config from '../config';
import gulp from 'gulp';
import sequence from 'run-sequence';

gulp.task('build', function(cb) {
	return sequence('js', cb);
});
