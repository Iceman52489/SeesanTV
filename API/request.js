var _ = require('underscore'),
    config = require('./config'),
    methods = require('methods'),
    charset = require('superagent-charset'),
    prefix = require('superagent-prefix')(config.api.host),
    superagent = require('superagent'),
    agent = superagent.agent(),
    Account = require('./models/Account'),

    uses = [];

// Charset encoding support
charset(superagent);

function request(url, method) {
  var $request;

  method = method || 'GET';

  $request = new superagent.Request(method, url)
    // Add prefix support to all requests
    .use(prefix)
    // Add charset support to all requests
    .charset(config.api.encoding);

  agent._attachCookies($request);

  return $request;
}

function getAccountCredentials(success, error) {
  Account
    .findOne({ provider: 'seesan' })
    .exec(function(err, credentials) {
      if(!err) {
        success(credentials);
      } else {
        error(err);
      }
    });
}

function login() {
  getAccountCredentials(function(credentials) {
    var account = {
      'email_login': credentials.username,
      'password_login': credentials.password
    };

    request('/login_check.php', 'POST')
      .type('form')
      .send(account)
      .end(function(err, response) {
        agent._saveCookies(response);
      });
  });
}

login();

module.exports = request;
