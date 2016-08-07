var uri = 'mongodb://{username}:{password}@{host}:{port}/{database}',
    options = {
      host: '127.0.0.1',
      port: 27017,
      database: 'seesanDB',
      username: 'mocha',
      password: 'lego8140'
    },

    handles = function(key) {
      return '{'+key+'}';
    },

    key;

for(key in options) {
  uri = uri.replace(handles(key), options[key]);
}

module.exports = {
  uri: uri
};
