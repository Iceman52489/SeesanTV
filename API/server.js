var restify = require('restify'),
    mongoose = require('mongoose'),
    server = restify.createServer(),
    config = require('./config'),
    routes = require('./routes');

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

server.use(restify.CORS());
server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.authorizationParser());

server.on('NotFound', function(req, res) {
  res.send(404);
});

/**
 * Routes
 */
server.get('/api/categories', routes.categories.find);
server.get('/api/categories/:id', routes.categories.findByID);
server.get('/api/programs', routes.programs.find);
server.get('/api/programs/:id', routes.programs.findByID);

server.get('/api/migrations/categories', routes.migrations.categories);
server.get('/api/migrations/programs/:id', routes.migrations.programs);

/**
 * API Server
 */
server.listen(config.server.port, config.server.host, function () {
  connectToDB();
  console.log('%s listening at %s', server.name, server.url);
});
