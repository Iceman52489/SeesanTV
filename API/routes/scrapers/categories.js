var request = require('../../request'),
    series = require('async/series'),
    x = require('x-ray')({ filters: require('./filters') }),
    config = require('../../config'),
    Category = require('../../models/Category'),
    categories;

function scrape(cb) {
  request('/')
    .end(function(err, response) {
      var html = response.text;

      x(html, '#feature-hilight-tabs ul.tabs-nav > li', [{
        id: 'a@href | parseCategoryID',
        category: 'a'
      }])(function(err, data) {
        categories = data;
        cb(null);
      });
    });
}

function save(cb) {
  var category,
      intCategory;

  for(intCategory = 0; intCategory < categories.length; intCategory++) {
    category = categories[intCategory];
    category.updatedAt = new Date;

    Category.findOneAndUpdate({ id: category.id }, category, { upsert: true }, function(err, doc) {
      if(err) {
        console.log(err);
      }
    });
  }

  cb(null, categories);
}

function run(req, callback) {
  series([
    scrape,
    save
  ], function(err, data) {
    callback(categories);
  });
}

module.exports = {
  run: run
};
