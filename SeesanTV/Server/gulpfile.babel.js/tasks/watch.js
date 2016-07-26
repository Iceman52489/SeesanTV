import config from '../config';
import gulp from 'gulp';

gulp.task('watch', function(cb) {
  gulp.watch(config.js.watch, ['js']);
});
