import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('default', function() {
  global.watch = true;
  runSequence(
    ['install','clean'],
    ['build'],
    ['watch','serve'], function() {
    console.log('Gulp successfully running');
  });
});
