var charset = require('superagent-charset'),
    request = require('superagent'),
    x = require('x-ray')({ filters: require('./filters') }),
    config = require('../config'),
    utils = require('./utilities'),
    Category = require('../models/Category');

// Charset encoding support
charset(request);

function migrateCategories(categories, cb) {
  var category,
      intCategory;

  for(intCategory = 0; intCategory < categories.length; intCategory++) {
    category = categories[intCategory];
    Category.findOneAndUpdate({ id: category.id }, category, { upsert: true }, function(err, doc) {
      if(err) {
        return res.send(500, { error: err });
      }

      return res.send("succesfully saved");
    });
  }

  cb();
}

function categories(req, res, next) {
  var resource = config.api.host;

  request
    .get(resource)
    .charset(config.api.encoding)
    .end(function(err, response) {
      var html = response.text;

      x(html, '#feature-hilight-tabs ul.tabs-nav > li', [{
        id: 'a@href | parseCategoryID',
        category: 'a'
      }])(function(err, data) {
        migrateCategories(data, function() {
          res.send(data.length + ' records migrated!');
          next();
        });
      });
    });
}

module.exports = categories;
