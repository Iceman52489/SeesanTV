import config from '../config';
import cssModulesify from 'css-modulesify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import install from 'gulp-install';
import merge from 'merge-stream';
import rename from 'gulp-rename';
import sequence from 'run-sequence';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import streamify from 'gulp-streamify';
import uglify from 'gulp-uglify';
import watchify from 'watchify';

import { extend } from 'underscore';
import handleErrors from '../utils/handle-errors';
import bundleLogger from '../utils/bundle-logger';

function bundle(bundler, params) {
  bundler.bundle()
    .on('error', handleErrors)
    .pipe(source(params.outputName))
    .pipe(buffer())
    .pipe(gulp.dest(params.dest));
    //.pipe(rename(config.rename))
    //.pipe(streamify(uglify(config.uglify)))
    //.pipe(gulp.dest(params.dest));

  bundleLogger.end(params.outputName);
  // bundleLogger.end(
  //   params.outputName
  //     .replace(/\.js/gi, '{suffix}.js')
  //     .replace(/\{suffix\}/gi, config.rename.suffix)
  // );
}

function build(bundleConfig) {
  let b,
      params = extend(bundleConfig, watchify.args, { debug: global.debug });

  b = browserify(params);
  b = b.plugin(cssModulesify, config.cssModulesify);

  if(global.watch) {
    b = b.plugin(watchify);
  }

  bundle(b, params);

  if(global.watch) {
    var bundleName = params.entries.join(',')[0].split('/');

    bundleLogger.watch(bundleName[bundleName.length - 1]);

    b.on('update', function() {
      bundleLogger.start(params.outputName);
      bundle(b, params);
    });
  }
};

gulp.task('js', function() {
  return build(config.js.bundle);
});
