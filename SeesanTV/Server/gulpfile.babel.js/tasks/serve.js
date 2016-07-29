import config from '../config';
import gulp from 'gulp';
import connect from 'gulp-connect'

gulp.task('serve', function() {
  connect.server(config.server);
});
