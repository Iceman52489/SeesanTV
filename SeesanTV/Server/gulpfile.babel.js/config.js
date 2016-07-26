import utils from 'gulp-util';

export default {
  install: [
    './package.json'
  ],

  cssModulesify: {
    rootDir: __dirname
  },

  server: {
    root: './',
    port: 9001,
    middleware: function(connect, opt) {
      return [
        function accessLog(req, res, next) {
          utils.log(
            utils.colors.green(req.method),
            req.url, 'HTTP/' + req.httpVersion,
            utils.colors.cyan(res.statusCode)
          );

          next();
        }
      ];
    }
  },

  clean: {
    src: [
      './application.js'
    ]
  },

  js: {
    bundle: {
      entries: ['./js/app.js'],
      dest: './',
      outputName: 'application.js'
    },

    watch: [
      './js/*.js',
      './css/*.css',
      './pages/**/*.js',
      './pages/**/*.hbs',
      './templates/*.hbs'
    ]
  }
};
