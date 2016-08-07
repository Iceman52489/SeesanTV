var config = require('../config');

module.exports.$url = function(path, params) {
  params = params || {};
  return (config.api.host + path);
};
