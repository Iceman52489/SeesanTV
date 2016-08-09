var restify = require('restify'),
    mongoose = require('mongoose'),
    pug = require('pug'),
    config = require('./config'),
    routes = require('./routes'),
    server;

/**
 * Closures
 */
function connectToDB() {
  mongoose.connect(config.db.uri);
};

/**
 * Database
 */
mongoose.connection.on('error', console.error.bind(console, 'Database connection error:'));
mongoose.connection.on('disconnected', function() {
  connectToDB();
});

/**
 * API Configuration
 */
restify.defaultResponseHeaders = function(data) {
  this.header('content-type', 'application/json');
};

server = restify.createServer({
  name: 'MochaAPI',
  version: '1.0.0'
});

server.use(restify.CORS());
server.use(restify.gzipResponse());
server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.authorizationParser());

function render(res, template, statusCode, headers) {
  var html = pug.renderFile('./views'+template);

  statusCode = statusCode || 200;
  headers = headers || {
    'Content-Length': Buffer.byteLength(html),
    'Content-Type': 'text/html'
  };

  res.writeHead(statusCode, headers);

  res.write(html);
  res.end();
}

server.on('NotFound', function(req, res) {
  render(res, '/errors/404.jade', 404);
});

server.on('uncaughtException', function(req, res, route, error) {
  render(res, '/errors/500.jade', 500)
});

/**
 * Routes
 */
server.get('/api/categories', routes.categories.find);
server.get('/api/categories/:id', routes.categories.findByID);
server.get('/api/categories/:id/programs', routes.programs.find);
server.get('/api/programs/:id', routes.programs.findByID);

/**
 * API Server
 */
server.listen(config.server.port, config.server.host, function () {
  connectToDB();
  console.log('%s listening at %s', server.name, server.url);
});
